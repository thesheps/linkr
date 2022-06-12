import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import { Function, Code, Runtime } from "aws-cdk-lib/aws-lambda";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { ARecord, IHostedZone, RecordTarget } from "aws-cdk-lib/aws-route53";
import { ApiGateway } from "aws-cdk-lib/aws-route53-targets";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { LinkrStackProps } from "./linkr-stack";

export type LinkrProxyProps = LinkrStackProps & {
	certificate: Certificate;
	zone: IHostedZone;
};

export class LinkrProxy extends Construct {
	constructor(scope: Construct, props: LinkrProxyProps) {
		super(scope, "LinkrProxy");

		const table = new Table(this, "Proxy", {
			partitionKey: { name: "path", type: AttributeType.STRING },
			tableName: "linkr-entries",
		});

		const dynamoLambda = new Function(this, "ProxyLambdaHandler", {
			runtime: Runtime.NODEJS_12_X,
			code: Code.fromAsset("build"),
			handler: "lambda.handler",
			functionName: "linkr-proxy-handler",
			environment: { PROXY_TABLE_NAME: table.tableName },
		});

		table.grantReadWriteData(dynamoLambda);

		const api = new RestApi(this, "ProxyApi", {
			domainName: {
				certificate: props.certificate,
				domainName: props.linkrDomainName,
			},
			restApiName: "linkr-proxy-api",
		});

		api.root.addProxy({
			defaultIntegration: new LambdaIntegration(dynamoLambda),
		});

		new ARecord(this, "ProxyARecord", {
			zone: props.zone,
			target: RecordTarget.fromAlias(new ApiGateway(api)),
		});
	}
}
