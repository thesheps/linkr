const { DynamoDB, Lambda } = require("aws-sdk");

exports.handler = async function (event: any) {
	console.log("request:", JSON.stringify(event, undefined, 2));

	const dynamo = new DynamoDB();

	await dynamo
		.updateItem({
			TableName: process.env.PROXY_TABLE_NAME,
			Key: { path: { S: event.rawPath } },
			UpdateExpression: "ADD hits :incr",
			ExpressionAttributeValues: { ":incr": { N: "1" } },
		})
		.promise();

	console.log("inserted counter for " + event.rawPath);

	return sendRes(200, "You have connected with the Lambda!");
};

const sendRes = (status: number, body: string) => {
	var response = {
		statusCode: status,
		headers: {
			"Content-Type": "text/html",
		},
		body: body,
	};

	return response;
};
