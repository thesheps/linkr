export const handler = async function (event: any) {
	console.log("request:", JSON.stringify(event, undefined, 2));

	const tableName = process.env.PROXY_TABLE_NAME;
	if (!tableName) return sendResponse(505, "Proxy table not found!");

	return {
		body: "I am working",
		headers: { "Content-Type": "application/json" },
		statusCode: 200,
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
