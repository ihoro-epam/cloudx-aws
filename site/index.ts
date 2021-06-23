import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import * as mime from 'mime';
import { readdirSync } from 'fs';
import { join } from 'path';

import * as policies from './policies';

const REPLICATION_REGION = 'eu-west-1';

function createReplicationRole(): aws.iam.Role {
    return new aws.iam.Role("replicationRole", {
        assumeRolePolicy: {
            Version: "2012-10-17",
            Statement: [{
                Action: "sts:AssumeRole",
                Principal: {
                    Service: "s3.amazonaws.com"
                },
                Effect: "Allow",
                Sid: "",
            }],
        },
    });
}

function createReplicationBucket(): aws.s3.Bucket {
    const replicationProvider = new aws.Provider(REPLICATION_REGION, { region: REPLICATION_REGION });
    return new aws.s3.Bucket('eu-west-1-replica', {
        versioning: {
            enabled: true,
        },
    }, { provider: replicationProvider });
}

function attachReplicationPolicy(source: aws.s3.Bucket, replicaBucket: aws.s3.Bucket, role: aws.iam.Role): void {
    const replicationPolicy = new aws.iam.Policy("replicationPolicy", {
        policy: policies.getS3ReplicationPolicy(source, replicaBucket),
    });
    new aws.iam.RolePolicyAttachment("replicationRolePolicyAttachment", {
        role: role.name,
        policyArn: replicationPolicy.arn,
    });
}

function createS3Bucket(): aws.s3.Bucket {
    const destination = createReplicationBucket();
    const replicationRole = createReplicationRole();
    const source = new aws.s3.Bucket('s3-website-bucket', {
        website: { indexDocument: 'index.html' },
        versioning: { enabled: true },
        replicationConfiguration: {
            role: replicationRole.arn,
            rules: [{
                status: "Enabled",
                destination: {
                    bucket: destination.arn,
                    storageClass: "STANDARD",
                },
            }],
        },
    });
    attachReplicationPolicy(source, destination, replicationRole);

    return source;
}

function uploadFiles(siteDir: string, siteBucket: aws.s3.Bucket): void {
    for (const item of readdirSync(siteDir)) {
        const filePath = join(siteDir, item);
        new aws.s3.BucketObject(item, {
            bucket: siteBucket,
            source: new pulumi.asset.FileAsset(filePath),
            contentType: mime.getType(filePath) || undefined,
        });
    }
}

function setBucketPolicy(siteBucket: aws.s3.Bucket) {
    new aws.s3.BucketPolicy('bucketPolicy', {
        bucket: siteBucket.bucket, // refer to the bucket created earlier
        policy: siteBucket.bucket.apply(policies.publicReadPolicyForBucket) // use output property `siteBucket.bucket`
    });
}

export default function(): aws.s3.Bucket {
    const bucket = createS3Bucket();
    uploadFiles('site/www', bucket);
    setBucketPolicy(bucket);
    return bucket;
}