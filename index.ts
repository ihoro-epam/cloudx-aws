import * as aws from "@pulumi/aws";

import * as policies from './policies';
import setupStaticWebPage from './site';

function configureEC2() {
    const policy = new aws.iam.Policy("FullAccessPolicyEC2", {
        path: "/",
        description: "any actions on the EC2 resources",
        policy: JSON.stringify(policies.fullAccessEC2),
    });
    new aws.iam.Role("FullAccessRoleEC2", {
        assumeRolePolicy: {
            Version: "2012-10-17",
            Statement: [{
                Action: "sts:AssumeRole",
                Principal: {
                    Service: "ec2.amazonaws.com"
                },
                Effect: "Allow",
                Sid: "",
            }],
        },
        description: 'EC2 full access role',
        managedPolicyArns: [policy.arn],
    });
    const group = new aws.iam.Group('FullAccessGroupEC2');
    new aws.iam.GroupPolicyAttachment("FullAccessPolicyEC2-attach", {
        group: group.name,
        policyArn: policy.arn,
    });
    const user = new aws.iam.User("ec2-full-access-user", {});
    new aws.iam.UserGroupMembership("FullAccessGroupEC2-membership", {
        user: user.name,
        groups: [group.name],
    });
}

function configureS3FullAccess() {
    const policy = new aws.iam.Policy("FullAccessPolicyS3", {
        path: "/",
        description: "any actions on the S3 resources",
        policy: JSON.stringify(policies.fullAccessS3),
    });
    new aws.iam.Role("FullAccessRoleS3", {
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
        description: 'S3 full access role',
        managedPolicyArns: [policy.arn],
    });
    const group = new aws.iam.Group('FullAccessGroupS3');
    new aws.iam.GroupPolicyAttachment("FullAccessPolicyS3-attach", {
        group: group.name,
        policyArn: policy.arn,
    });
    const user = new aws.iam.User("s3-full-access-user", {});
    new aws.iam.UserGroupMembership("FullAccessGroupS3-membership", {
        user: user.name,
        groups: [group.name],
    });
}

function configureS3ReadAccess() {
    const policy = new aws.iam.Policy("ReadAccessPolicyS3", {
        path: "/",
        description: "read actions on the S3 resources",
        policy: JSON.stringify(policies.readAccessS3),
    });
    new aws.iam.Role("ReadAccessRoleS3", {
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
        description: 's3 read access role',
        managedPolicyArns: [policy.arn],
    });
    const group = new aws.iam.Group('ReadAccessGroupS3');
    new aws.iam.GroupPolicyAttachment("ReadAccessPolicyS3-attach", {
        group: group.name,
        policyArn: policy.arn,
    });
    const user = new aws.iam.User("s3-read-access-user", {});
    new aws.iam.UserGroupMembership("ReadAccessGroupS3-membership", {
        user: user.name,
        groups: [group.name],
    });
}

function createGroups(): void {
    const groupNames = [
        'CoordinatorsGroup',
        'MentorsGroup',
        'MenteesGroup'
    ];

    for (const name of groupNames) {
        new aws.iam.Group(name);
    }
}

createGroups();
configureEC2();
configureS3FullAccess();
configureS3ReadAccess();
const bucket = setupStaticWebPage();

export const websiteUrl = bucket.websiteEndpoint;
