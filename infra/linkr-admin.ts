import { Function, Code, Runtime } from "aws-cdk-lib/aws-lambda";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { ARecord, IHostedZone, RecordTarget } from "aws-cdk-lib/aws-route53";
import { ApiGateway } from "aws-cdk-lib/aws-route53-targets";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

import { LinkrStackProps } from "./linkr-stack";

export type LinkrAdminProps = LinkrStackProps & {
	certificate: Certificate;
	zone: IHostedZone;
	table: Table;
};

export class LinkrAdmin extends Construct {
	constructor(scope: Construct, props: LinkrAdminProps) {
		super(scope, "LinkrAdmin");

		const lambda = new Function(this, "ProxyLambdaHandler", {
			runtime: Runtime.NODEJS_12_X,
			code: Code.fromAsset("build"),
			handler: "admin-lambda.handler",
			functionName: "linkr-admin-handler",
			environment: {
				PROXY_TABLE_NAME: props.table.tableName,
			},
		});

		props.table.grantReadWriteData(lambda);

		const defaultIntegration = new LambdaIntegration(lambda);
		const api = new RestApi(this, "AdminApi", {
			domainName: {
				certificate: props.certificate,
				domainName: `api.${props.linkrDomainName}`,
			},
			restApiName: "linkr-admin-api",
			defaultIntegration,
		});

		api.root.addProxy({ defaultIntegration });

		new ARecord(this, "ProxyARecord", {
			recordName: "api",
			zone: props.zone,
			target: RecordTarget.fromAlias(new ApiGateway(api)),
		});
	}
}