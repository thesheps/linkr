import { Table } from "aws-cdk-lib/aws-dynamodb";
import { Function, Code, Runtime } from "aws-cdk-lib/aws-lambda";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { ARecord, IHostedZone, RecordTarget } from "aws-cdk-lib/aws-route53";
import { ApiGateway } from "aws-cdk-lib/aws-route53-targets";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { Construct } from "constructs";

import { LinkrStackProps } from "./linkr-stack";

export type LinkrProxyProps = LinkrStackProps & {
	certificate: Certificate;
	zone: IHostedZone;
	table: Table;
};

export class LinkrProxy extends Construct {
	constructor(scope: Construct, props: LinkrProxyProps) {
		super(scope, "LinkrProxy");

		const lambda = new Function(this, "ProxyLambdaHandler", {
			runtime: Runtime.NODEJS_12_X,
			code: Code.fromAsset("build/proxy-lambda"),
			handler: "proxy-lambda.handler",
			functionName: "linkr-proxy-handler",
			environment: {
				PROXY_TABLE_NAME: props.table.tableName,
				DEFAULT_REDIRECT: props.defaultRedirect,
			},
		});

		props.table.grantReadWriteData(lambda);

		const defaultIntegration = new LambdaIntegration(lambda);
		const api = new RestApi(this, "ProxyApi", {
			domainName: {
				certificate: props.certificate,
				domainName: props.linkrDomainName,
			},
			restApiName: "linkr-proxy-api",
			defaultIntegration,
		});

		api.root.addProxy({ defaultIntegration });

		new ARecord(this, "ProxyARecord", {
			zone: props.zone,
			target: RecordTarget.fromAlias(new ApiGateway(api)),
		});
	}
}
