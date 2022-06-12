import { handler } from "../admin-lambda";

jest.mock("aws-sdk");
global.console.log = jest.fn();

const proxyTable = "beans-on-toast";
const updateItem = jest.fn().mockReturnValue({ promise: jest.fn() });

describe("Admin Lambda", () => {
	const { DynamoDB } = require("aws-sdk");

	beforeEach(() => {
		process.env.PROXY_TABLE_NAME = proxyTable;
		DynamoDB.mockImplementation(() => ({ updateItem }));
	});

	it("Returns OK", async () => {
		const response = await handler({});

		expect(response).toEqual({
			body: "I am working",
			headers: { "Content-Type": "application/json" },
			statusCode: 200,
		});
	});
});
