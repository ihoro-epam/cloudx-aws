import { PolicyDocument } from "@pulumi/aws/iam";
import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

export function publicReadPolicyForBucket(bucketName: string): PolicyDocument {
    return {
        Version: "2012-10-17",
        Statement: [{
            Effect: "Allow",
            Principal: "*",
            Action: [
                "s3:GetObject"
            ],
            Resource: [
                `arn:aws:s3:::${bucketName}/*`
            ]
        }]
    };
}

export const getS3ReplicationPolicy = (source: aws.s3.Bucket, destination: aws.s3.Bucket) => pulumi.interpolate`{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": [
                "s3:GetReplicationConfiguration",
                "s3:ListBucket"
            ],
            "Effect": "Allow",
            "Resource": [
                "${source.arn}"
            ]
        },
        {
            "Action": [
                "s3:GetObjectVersionForReplication",
                "s3:GetObjectVersionAcl",
                "s3:GetObjectVersionTagging"
            ],
            "Effect": "Allow",
            "Resource": [
                "${source.arn}/*"
            ]
        },
        {
            "Action": [
                "s3:ReplicateObject",
                "s3:ReplicateDelete",
                "s3:ReplicateTags"
            ],
            "Effect": "Allow",
            "Resource": "${destination.arn}/*"
        }
    ]
}`