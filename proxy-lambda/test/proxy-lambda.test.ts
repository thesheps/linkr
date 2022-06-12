const lambda = require("../proxy-lambda");

jest.mock("aws-sdk");
global.console.log = jest.fn();

const proxyTable = "beans-on-toast";
const defaultRedirect = "default-redirect.com";
const testEvent = { requestContext: { path: "/beans" } };
const updateItem = jest.fn().mockReturnValue({ promise: jest.fn() });

describe("Proxy Lambda", () => {
	const { DynamoDB } = require("aws-sdk");

	beforeEach(() => {
		process.env.PROXY_TABLE_NAME = proxyTable;
		process.env.DEFAULT_REDIRECT = defaultRedirect;

		DynamoDB.mockImplementation(() => ({
			updateItem,
		}));
	});

	it("Throws an error when misconfigured", async () => {
		delete process.env.PROXY_TABLE_NAME;
		const response = await lambda.handler();

		expect(response).toEqual({
			body: "Proxy table not found!",
			headers: {
				"Content-Type": "text/html",
			},
			statusCode: 505,
		});
	});

	it("Throws an error when misconfigured", async () => {
		delete process.env.DEFAULT_REDIRECT;
		const response = await lambda.handler();

		expect(response).toEqual({
			body: "Default redirect not found!",
			headers: {
				"Content-Type": "text/html",
			},
			statusCode: 505,
		});
	});

	it("Updates the hit count for the specified path", async () => {
		await lambda.handler(testEvent);

		expect(updateItem).toBeCalledWith({
			ExpressionAttributeValues: { ":incr": { N: "1" } },
			Key: { path: { S: "/beans" } },
			TableName: proxyTable,
			UpdateExpression: "ADD hits :incr",
		});
	});

	it("Redirects the user to default redirect", async () => {
		const response = await lambda.handler(testEvent);

		expect(response).toEqual({
			headers: {
				Location: defaultRedirect,
			},
			statusCode: 301,
		});
	});
});