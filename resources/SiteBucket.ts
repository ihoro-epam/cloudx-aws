import {readdirSync} from "fs";
import {join} from "path";
import * as mime from "mime";
import * as pulumi from '@pulumi/pulumi';
import {Inputs} from "@pulumi/pulumi/output";
import {ComponentResourceOptions} from "@pulumi/pulumi/resource";
import * as aws from "@pulumi/aws";

import * as policies from "./policies";

export class SiteBucket extends pulumi.ComponentResource {
    public static type = 'cloud-aws:SiteBucket';

    private readonly bucket: aws.s3.Bucket;

    constructor(name: string, args?: Inputs, opts?: ComponentResourceOptions) {
        super(SiteBucket.type, name, {}, opts);

        this.bucket = new aws.s3.Bucket('website-bucket');

        this.uploadFiles('site/www')

        this.setBucketPolicy()
    }

    get bucketName(): pulumi.Output<string> {
        return this.bucket.bucket;
    }

    get bucketRegionalDomainName(): pulumi.Output<string> {
        return this.bucket.bucketRegionalDomainName;
    }

    private uploadFiles(siteDir: string): void {
        for (const item of readdirSync(siteDir)) {
            const filePath = join(siteDir, item);
            new aws.s3.BucketObject(item, {
                bucket: this.bucket,
                source: new pulumi.asset.FileAsset(filePath),
                contentType: mime.getType(filePath) || undefined,
            });
        }
    }

    private setBucketPolicy() {
        new aws.s3.BucketPolicy('website-bucket-policy', {
            bucket: this.bucket.bucket,
            policy: this.bucket.bucket.apply(policies.publicReadPolicyForBucket),
        });
    }
}