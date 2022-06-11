import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';

import { LinkrStack } from '../linkr-stack';

const stack = new LinkrStack(new App(), 'MyTestStack');
const template = Template.fromStack(stack);

test('DynamoDB', () => {
  template.hasResourceProperties("AWS::DynamoDB::Table", {
    KeySchema: [
      {
        AttributeName: "path",
        KeyType: "HASH"
      }
    ],
    AttributeDefinitions: [
      {
        AttributeName: "path",
        AttributeType: "S"
      }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  });
});

test('DynamoDB Read/Write IAM Policy', () => {
  template.hasResourceProperties("AWS::IAM::Policy", {
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
          Effect: "Allow"
        }]
    }
  });
});

test('Lambda', () => {
  template.hasResourceProperties("AWS::Lambda::Function", {
    Handler: "lambda.handler",
    Runtime: "nodejs12.x"
  });
});

describe('API Gateway', () => {
  template.hasResourceProperties("AWS::ApiGateway::RestApi", {
    Name: "linkr-proxy-api",
  });
});
