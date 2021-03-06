export const fullAccessS3 = {
    Version: "2012-10-17",
    Statement: [{
        Action: ["s3:*"],
        Effect: "Allow",
        Resource: "*",
    }],
};

export const fullAccessEC2 = {
    Version: "2012-10-17",
    Statement: [{
        Action: ["ec2:*"],
        Effect: "Allow",
        Resource: "*",
    }],
};

export const readAccessS3 = {
    Version: "2012-10-17",
    Statement: [{
        Action: [
            "s3:ListAccessPointsForObjectLambda",
            "s3:GetAccessPoint",
            "s3:GetLifecycleConfiguration",
            "s3:GetBucketTagging",
            "s3:GetInventoryConfiguration",
            "s3:GetAccessPointPolicyForObjectLambda",
            "s3:GetObjectVersionTagging",
            "s3:GetBucketLogging",
            "s3:GetAccelerateConfiguration",
            "s3:GetBucketPolicy",
            "s3:GetStorageLensConfigurationTagging",
            "s3:GetObjectVersionTorrent",
            "s3:GetObjectAcl",
            "s3:GetEncryptionConfiguration",
            "s3:GetBucketObjectLockConfiguration",
            "s3:GetIntelligentTieringConfiguration",
            "s3:GetBucketRequestPayment",
            "s3:GetAccessPointPolicyStatus",
            "s3:GetObjectVersionAcl",
            "s3:GetObjectTagging",
            "s3:GetMetricsConfiguration",
            "s3:GetBucketOwnershipControls",
            "s3:GetBucketPublicAccessBlock",
            "s3:GetBucketPolicyStatus",
            "s3:GetObjectRetention",
            "s3:GetBucketWebsite",
            "s3:GetJobTagging",
            "s3:GetAccessPointPolicyStatusForObjectLambda",
            "s3:ListAccessPoints",
            "s3:GetBucketVersioning",
            "s3:GetBucketAcl",
            "s3:GetObjectLegalHold",
            "s3:GetAccessPointConfigurationForObjectLambda",
            "s3:GetBucketNotification",
            "s3:GetReplicationConfiguration",
            "s3:GetObject",
            "s3:GetStorageLensConfiguration",
            "s3:GetObjectTorrent",
            "s3:GetAccountPublicAccessBlock",
            "s3:DescribeJob",
            "s3:GetBucketCORS",
            "s3:GetAnalyticsConfiguration",
            "s3:GetObjectVersionForReplication",
            "s3:GetBucketLocation",
            "s3:GetAccessPointPolicy",
            "s3:GetAccessPointForObjectLambda",
            "s3:GetObjectVersion",
            "s3:GetStorageLensDashboard"
        ],
        Effect: "Allow",
        Resource: "*",
    }],
}