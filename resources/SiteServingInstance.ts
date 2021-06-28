import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import {Inputs} from "@pulumi/pulumi/output";
import {ComponentResourceOptions} from "@pulumi/pulumi/resource";

import { SiteServingSecurityGroup } from './security-groups/SiteServingSecurityGroup';
import {SiteBucket} from "./SiteBucket";

export class SiteServingInstance extends pulumi.ComponentResource {
    public static type = 'cloud-aws:SiteServingInstance';

    private instance: aws.ec2.Instance;
    private securityGroup: SiteServingSecurityGroup;
    private sourceBucket: SiteBucket;

    constructor(name: string, args?: Inputs, opts?: ComponentResourceOptions) {
        super(SiteServingInstance.type, name, {}, opts);

        this.securityGroup = new SiteServingSecurityGroup('web-server-sg');
        this.sourceBucket = new SiteBucket('web-server-source');

        this.instance = new aws.ec2.Instance("web-server", {
            ami: "ami-089b5384aac360007",
            instanceType: "t2.micro",
            securityGroups: [this.securityGroup.sgName],
            keyName: 'ec2-module',
            userData: `
                #!/bin/bash
                # Use this for your user data (script from top to bottom)
                # install httpd (Linux 2 version)
                sudo yum update -y
                sudo yum install -y httpd
                systemctl start httpd
                systemctl enable httpd
                sudo wget -P /var/www/html/ website-bucket-acb05b4.s3.eu-central-1.amazonaws.com/index.html
                sudo wget -P /var/www/html/ website-bucket-acb05b4.s3.eu-central-1.amazonaws.com/index.css
            `
        });

        this.registerOutputs();
    }

    get siteBucketDomain() {
        return this.sourceBucket.bucketRegionalDomainName;
    }

    get publicIp() {
        return this.instance.publicIp;
    }
}