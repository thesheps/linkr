import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import { Function, Code, Runtime } from "aws-cdk-lib/aws-lambda";
import { LambdaIntegration, Method, RestApi } from "aws-cdk-lib/aws-apigateway";
import { HttpMethod } from "aws-cdk-lib/aws-events";
import { Construct } from "constructs";
import { ARecord, HostedZone, RecordTarget } from "aws-cdk-lib/aws-route53";
import { ApiGateway } from "aws-cdk-lib/aws-route53-targets";
import {
	Certificate,
	CertificateValidation,
} from "aws-cdk-lib/aws-certificatemanager";

export type LinkrStackProps = StackProps & {
	linkrDomainName: string;
	linkrHostedZoneId: string;
};

export class LinkrStack extends Stack {
	constructor(scope: Construct, id: string, props: LinkrStackProps) {
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

		const certificate = new Certificate(this, "ProxyApiCertificate", {
			domainName: props.linkrDomainName,
			validation: CertificateValidation.fromDns(),
		});

		const api = new RestApi(this, "ProxyApi", {
			domainName: { certificate, domainName: props.linkrDomainName },
			defaultIntegration: new LambdaIntegration(dynamoLambda),
			restApiName: "linkr-proxy-api",
		});

		const getMethod = new Method(this, "GetMethod", {
			httpMethod: HttpMethod.GET,
			resource: api.root,
		});

		const zone = HostedZone.fromHostedZoneAttributes(this, "LinkrHostedZone", {
			hostedZoneId: props.linkrHostedZoneId,
			zoneName: props.linkrDomainName,
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
