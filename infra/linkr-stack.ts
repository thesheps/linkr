import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import { Function, Code, Runtime } from "aws-cdk-lib/aws-lambda";
import { LambdaIntegration, Method, RestApi } from "aws-cdk-lib/aws-apigateway";
import { HttpMethod } from "aws-cdk-lib/aws-events";
import { Construct } from "constructs";
import {
	ARecord,
	PublicHostedZone,
	RecordTarget,
} from "aws-cdk-lib/aws-route53";
import { ApiGateway } from "aws-cdk-lib/aws-route53-targets";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";

export class LinkrStack extends Stack {
	constructor(scope: Construct, id: string, props?: StackProps) {
		super(scope, id, props);

		const table = new Table(this, "Proxy", {
			partitionKey: { name: "path", type: AttributeType.STRING },
			tableName: "linkr-entries",
		});

		const dynamoLambda = new Function(this, "DynamoLambdaHandler", {
			runtime: Runtime.NODEJS_12_X,
			code: Code.fromAsset("build"),
			handler: "lambda.handler",
			functionName: "linkr-handler",
			environment: {
				PROXY_TABLE_NAME: table.tableName,
			},
		});

		table.grantReadWriteData(dynamoLambda);

		const recordName = process.env.LINKR_DOMAIN ?? "";
		const certificate = new Certificate(this, "ProxyApiCertificate", {
			domainName: recordName,
		});

		const api = new RestApi(this, "ProxyApi", {
			domainName: { certificate, domainName: recordName },
			defaultIntegration: new LambdaIntegration(dynamoLambda),
			restApiName: "linkr-proxy-api",
		});

		const getMethod = new Method(this, "GetMethod", {
			httpMethod: HttpMethod.GET,
			resource: api.root,
		});

		const zone = new PublicHostedZone(this, "LinkrHostedZone", {
			zoneName: "linkr",
		});

		new ARecord(this, "LinkrRecord", {
			zone,
			target: RecordTarget.fromAlias(new ApiGateway(api)),
		});

		new CfnOutput(this, "HTTP API Url", {
			value: api.url ?? "API URL not found",
		});
	}
}
