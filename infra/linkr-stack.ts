import { Stack, StackProps } from "aws-cdk-lib";
import { HostedZone } from "aws-cdk-lib/aws-route53";
import { Construct } from "constructs";
import {
	Certificate,
	CertificateValidation,
} from "aws-cdk-lib/aws-certificatemanager";

import { LinkrProxy } from "./linkr-proxy";

export type LinkrStackProps = StackProps & {
	linkrDomainName: string;
	linkrHostedZoneId: string;
};

export class LinkrStack extends Stack {
	constructor(scope: Construct, id: string, props: LinkrStackProps) {
		super(scope, id, props);

		const zone = HostedZone.fromHostedZoneAttributes(this, "LinkrHostedZone", {
			hostedZoneId: props.linkrHostedZoneId,
			zoneName: props.linkrDomainName,
		});

		const certificate = new Certificate(this, "ProxyApiCertificate", {
			domainName: props.linkrDomainName,
			validation: CertificateValidation.fromDns(),
		});

		new LinkrProxy(this, {
			...props,
			certificate,
			zone,
		});
	}
}
