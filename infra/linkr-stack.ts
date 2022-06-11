import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import { Function, Code, Runtime } from "aws-cdk-lib/aws-lambda";
import { LambdaIntegration, Method, RestApi } from "aws-cdk-lib/aws-apigateway";
import { HttpMethod } from "aws-cdk-lib/aws-events";
import { Construct } from "constructs";

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

    const api = new RestApi(this, "ProxyApi", {
      defaultIntegration: new LambdaIntegration(dynamoLambda),
      restApiName: "linkr-proxy-api",
    });

    const getMethod = new Method(this, "GetMethod", {
      httpMethod: HttpMethod.GET,
      resource: api.root,
    });

    new CfnOutput(this, "HTTP API Url", {
      value: api.url ?? "API URL not found",
    });
  }
}
