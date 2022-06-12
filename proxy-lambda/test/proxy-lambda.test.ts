const lambda = require("../proxy-lambda");

jest.mock("aws-sdk");
global.console.log = jest.fn();

const testEvent = { requestContext: { path: "/beans" } };
const updateItem = jest.fn().mockReturnValue({ promise: jest.fn() });

describe("Proxy Lambda", () => {
	const { DynamoDB } = require("aws-sdk");

	beforeEach(() => {
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

	it("Updates the hit count for the specified path", async () => {
		process.env.PROXY_TABLE_NAME = "beans on toast";
		await lambda.handler(testEvent);

		expect(updateItem).toBeCalledWith({
			ExpressionAttributeValues: { ":incr": { N: "1" } },
			Key: { path: { S: "/beans" } },
			TableName: "beans on toast",
			UpdateExpression: "ADD hits :incr",
		});
	});

	it("Redirects the user to thesheps.dev", async () => {
		process.env.PROXY_TABLE_NAME = "beans on toast";
		const response = await lambda.handler(testEvent);

		expect(response).toEqual({
			headers: {
				Location: "https://www.thesheps.dev",
			},
			statusCode: 301,
		});
	});
});
