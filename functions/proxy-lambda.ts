import { DynamoDB } from "aws-sdk";

export const handler = async function (event: any) {
	console.log("request:", JSON.stringify(event, undefined, 2));

	const tableName = process.env.LINKR_PROXY_TABLE_NAME;
	const defaultRedirect = process.env.LINKR_DEFAULT_REDIRECT;

	if (!defaultRedirect) return sendResponse(505, "Default redirect not found!");
	if (!tableName) return sendResponse(505, "Proxy table not found!");

	const dynamo = new DynamoDB();

	const entry = await dynamo
		.getItem({
			TableName: tableName,
			Key: { shortUrl: { S: event.path } },
		})
		.promise();

	if (!entry.Item) {
		return {
			headers: { Location: defaultRedirect },
			statusCode: 301,
		};
	}

	await dynamo
		.updateItem({
			TableName: tableName,
			Key: { shortUrl: { S: event.path } },
			UpdateExpression: "ADD hits :incr",
			ExpressionAttributeValues: { ":incr": { N: "1" } },
		})
		.promise();

	return {
		headers: { Location: entry.Item.longUrl.S },
		statusCode: 301,
	};
};

const sendResponse = (status: number, body: string) => {
	var response = {
		body: body,
		headers: { "Content-Type": "text/html" },
		statusCode: status,
	};

	return response;
};
