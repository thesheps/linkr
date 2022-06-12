import { Stack, StackProps } from "aws-cdk-lib";
import { HostedZone } from "aws-cdk-lib/aws-route53";
import { Construct } from "constructs";
import {
	Certificate,
	CertificateValidation,
} from "aws-cdk-lib/aws-certificatemanager";

import { LinkrProxy } from "./linkr-proxy";
import { LinkrAdmin } from "./linkr-admin";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";

export type LinkrStackProps = StackProps & {
	linkrDomainName: string;
	linkrHostedZoneId: string;
	defaultRedirect: string;
};

export class LinkrStack extends Stack {
	constructor(scope: Construct, id: string, props: LinkrStackProps) {
		super(scope, id, props);

		const zone = HostedZone.fromHostedZoneAttributes(this, "LinkrHostedZone", {
			hostedZoneId: props.linkrHostedZoneId,
			zoneName: props.linkrDomainName,
		});

		const certificate = new Certificate(this, "LinkrCertificate", {
			domainName: props.linkrDomainName,
			validation: CertificateValidation.fromDns(),
			subjectAlternativeNames: ["api", "www"],
		});

		const table = new Table(this, "LinkrTable", {
			partitionKey: { name: "path", type: AttributeType.STRING },
			tableName: "linkr-entries",
		});

		new LinkrProxy(this, {
			...props,
			certificate,
			zone,
			table,
		});

		new LinkrAdmin(this, {
			...props,
			certificate,
			zone,
			table,
		});
	}
}
