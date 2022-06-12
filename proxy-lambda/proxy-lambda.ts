const { DynamoDB, Lambda } = require("aws-sdk");

exports.handler = async function (event: any) {
	console.log("request:", JSON.stringify(event, undefined, 2));

	const TableName = process.env.PROXY_TABLE_NAME;
	if (!TableName) return sendResponse(505, "Proxy table not found!");

	const dynamo = new DynamoDB();

	await dynamo
		.updateItem({
			TableName,
			Key: { path: { S: event.requestContext.path } },
			UpdateExpression: "ADD hits :incr",
			ExpressionAttributeValues: { ":incr": { N: "1" } },
		})
		.promise();

	return {
		statusCode: 301,
		headers: {
			Location: "https://www.thesheps.dev",
		},
	};
};

const sendResponse = (status: number, body: string) => {
	var response = {
		statusCode: status,
		headers: {
			"Content-Type": "text/html",
		},
		body: body,
	};

	return response;
};
