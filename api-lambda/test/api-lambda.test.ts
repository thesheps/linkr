const lambda = require("../api-lambda");

jest.mock("aws-sdk");
global.console.log = jest.fn();

const proxyTable = "beans-on-toast";
const defaultRedirect = "default-redirect.com";
const testEvent = { requestContext: { path: "/beans" } };
const updateItem = jest.fn().mockReturnValue({ promise: jest.fn() });

describe("API Lambda", () => {
	const { DynamoDB } = require("aws-sdk");

	beforeEach(() => {
		process.env.PROXY_TABLE_NAME = proxyTable;
		process.env.DEFAULT_REDIRECT = defaultRedirect;

		DynamoDB.mockImplementation(() => ({
			updateItem,
		}));
	});

	it("Returns OK", async () => {
		const response = await lambda.handler();

		expect(response).toEqual({
			body: "Looks like I'm working, right?",
			statusCode: 200,
		});
	});
});
