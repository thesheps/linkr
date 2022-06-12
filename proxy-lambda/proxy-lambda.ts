const { DynamoDB, Lambda } = require("aws-sdk");

exports.handler = async function (event: any) {
	console.log("request:", JSON.stringify(event, undefined, 2));

	const tableName = process.env.PROXY_TABLE_NAME;
	const defaultRedirect = process.env.DEFAULT_REDIRECT;

	if (!defaultRedirect) return sendResponse(505, "Default redirect not found!");
	if (!tableName) return sendResponse(505, "Proxy table not found!");

	const dynamo = new DynamoDB();

	await dynamo
		.updateItem({
			TableName: tableName,
			Key: { path: { S: event.requestContext.path } },
			UpdateExpression: "ADD hits :incr",
			ExpressionAttributeValues: { ":incr": { N: "1" } },
		})
		.promise();

	return {
		statusCode: 301,
		headers: {
			Location: defaultRedirect,
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
