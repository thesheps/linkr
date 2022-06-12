import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";

import { LinkrStack } from "../linkr-stack";

const template = Template.fromStack(
	new LinkrStack(new App(), "MyTestStack", {
		linkrDomainName: "linkr.com",
		linkrHostedZoneId: "ABCDE",
		defaultRedirect: "https://www.linkr.com",
	})
);

describe("Configured environment", () => {
	test("DynamoDB", () => {
		template.hasResourceProperties("AWS::DynamoDB::Table", {
			KeySchema: [
				{
					AttributeName: "path",
					KeyType: "HASH",
				},
			],
			AttributeDefinitions: [
				{
					AttributeName: "path",
					AttributeType: "S",
				},
			],
			ProvisionedThroughput: {
				ReadCapacityUnits: 5,
				WriteCapacityUnits: 5,
			},
		});
	});

	test("Certificate", () => {
		template.hasResourceProperties("AWS::CertificateManager::Certificate", {
			DomainName: "linkr.com",
			ValidationMethod: "DNS",
		});
	});

	describe("Proxy Api", () => {
		test("DynamoDB Read/Write IAM Policy", () => {
			template.hasResourceProperties("AWS::IAM::Policy", {
				PolicyName:
					"LinkrProxyProxyLambdaHandlerServiceRoleDefaultPolicy188BE9B2",
				PolicyDocument: {
					Statement: [
						{
							Action: [
								"dynamodb:BatchGetItem",
								"dynamodb:GetRecords",
								"dynamodb:GetShardIterator",
								"dynamodb:Query",
								"dynamodb:GetItem",
								"dynamodb:Scan",
								"dynamodb:ConditionCheckItem",
								"dynamodb:BatchWriteItem",
								"dynamodb:PutItem",
								"dynamodb:UpdateItem",
								"dynamodb:DeleteItem",
								"dynamodb:DescribeTable",
							],
							Effect: "Allow",
						},
					],
				},
			});
		});

		test("Lambda", () => {
			template.hasResourceProperties("AWS::Lambda::Function", {
				Handler: "proxy-lambda.handler",
				Runtime: "nodejs12.x",
			});
		});

		test("API Gateway", () => {
			template.hasResourceProperties("AWS::ApiGateway::RestApi", {
				Name: "linkr-proxy-api",
			});
		});

		test("Route53", () => {
			template.hasResourceProperties("AWS::Route53::RecordSet", {
				Name: "linkr.com.",
				AliasTarget: {},
			});
		});
	});

	describe("Admin Api", () => {
		test("DynamoDB Read/Write IAM Policy", () => {
			template.hasResourceProperties("AWS::IAM::Policy", {
				PolicyName:
					"LinkrAdminProxyLambdaHandlerServiceRoleDefaultPolicy8C68756A",
				PolicyDocument: {
					Statement: [
						{
							Action: [
								"dynamodb:BatchGetItem",
								"dynamodb:GetRecords",
								"dynamodb:GetShardIterator",
								"dynamodb:Query",
								"dynamodb:GetItem",
								"dynamodb:Scan",
								"dynamodb:ConditionCheckItem",
								"dynamodb:BatchWriteItem",
								"dynamodb:PutItem",
								"dynamodb:UpdateItem",
								"dynamodb:DeleteItem",
								"dynamodb:DescribeTable",
							],
							Effect: "Allow",
						},
					],
				},
			});
		});

		test("Lambda", () => {
			template.hasResourceProperties("AWS::Lambda::Function", {
				Handler: "admin-lambda.handler",
				Runtime: "nodejs12.x",
			});
		});

		test("API Gateway", () => {
			template.hasResourceProperties("AWS::ApiGateway::RestApi", {
				Name: "linkr-admin-api",
			});
		});

		test("Route53", () => {
			template.hasResourceProperties("AWS::Route53::RecordSet", {
				Name: "api.linkr.com.",
				AliasTarget: {},
			});
		});
	});
});

describe("Unconfigured environment", () => {
	it("Throws an error", () => {
		const func = () => require("../linkr");
		expect(func).toThrowError("Environment not configured!");
	});
});
