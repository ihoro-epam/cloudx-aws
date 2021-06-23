import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import * as mime from 'mime';
import { readdirSync } from 'fs';
import { join } from 'path';

import * as policies from './policies';

function createS3Bucket(): aws.s3.Bucket {
    return  new aws.s3.Bucket('s3-website-bucket', {
        website: {
            indexDocument: 'index.html',
        },
    });
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