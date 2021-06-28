import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import {Inputs} from "@pulumi/pulumi/output";
import {ComponentResourceOptions} from "@pulumi/pulumi/resource";

export class SiteServingSecurityGroup extends pulumi.ComponentResource {
    public static type = 'cloud-aws:SiteServingSecurityGourp';

    private ingress = [
        {
            description: "Allow HTTP inbound traffic",
            fromPort: 80,
            toPort: 80,
            protocol: "tcp",
            cidrBlocks: ['0.0.0.0/0'],
        },
        {
            description: "Allow HTTPS inbound traffic",
            fromPort: 443,
            toPort: 443,
            protocol: "tcp",
            cidrBlocks: ['0.0.0.0/0'],
        },
        {
            description: "Allow HTTP inbound traffic",
            fromPort: 22,
            toPort: 22,
            protocol: "tcp",
            cidrBlocks: ['176.106.217.144/32']
        }
    ];

    private egress = [
        {
            description: "Allow all outbound traffic",
            fromPort: 0,
            toPort: 65535,
            protocol: "tcp",
            cidrBlocks: ['0.0.0.0/0'],
        }
    ]

    private sg: aws.ec2.SecurityGroup;

    constructor(name: string, args?: Inputs, opts?: ComponentResourceOptions) {
        super(SiteServingSecurityGroup.type, name, {}, opts);

        this.sg = new aws.ec2.SecurityGroup(name, {
            description: "SiteServingSecurityGroup",
            ingress: this.ingress,
            egress: this.egress,
        });
    }

    get sgName(): pulumi.Output<string> {
        return this.sg.name;
    }
}