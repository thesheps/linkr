import { DynamoDB } from "aws-sdk";

import shorten from "./shorten";

export const handler = async function (event: any) {
	console.log("request:", JSON.stringify(event, undefined, 2));

	if (event.path !== "/entries") return { statusCode: 404 };

	const tableName = process.env.LINKR_PROXY_TABLE_NAME;
	if (!tableName) return sendResponse(505, "Proxy table not found!");

	const linkrDomain = process.env.LINKR_DOMAIN;
	if (!linkrDomain) return sendResponse(505, "Base URL not found!");

	const body = JSON.parse(event.body);
	const shortUrl = shorten(body.longUrl, linkrDomain);
	const dynamo = new DynamoDB();

	await dynamo
		.updateItem({
			TableName: tableName,
			Key: { path: { S: event.path } },
			UpdateExpression: "SET shortUrl = :shortUrl",
			ExpressionAttributeValues: { ":shortUrl": { S: shortUrl } },
		})
		.promise();

	return {
		body: JSON.stringify({ shortUrl }),
		headers: { "Content-Type": "application/json" },
		statusCode: 200,
	};
};

const sendResponse = (status: number, body: string) => {
	var response = {
		body: body,
		statusCode: status,
	};

	return response;
};
