import { handler } from "../admin-lambda";

jest.mock("aws-sdk");
global.console.log = jest.fn();

const putItem = jest.fn().mockReturnValue({ promise: jest.fn() });
const expectedShortUrl = "https://linkr.com/1A95TU";
const longUrl = "https://www.big-url.com/my-lovely-path";
const proxyTable = "beans-on-toast";
const proxyBaseDomain = "linkr.com";
const testEvent = {
	httpMethod: "POST",
	path: "/entries",
	body: JSON.stringify({
		longUrl,
	}),
};

describe("Admin Lambda", () => {
	const { DynamoDB } = require("aws-sdk");

	beforeEach(() => {
		process.env.LINKR_PROXY_TABLE_NAME = proxyTable;
		process.env.LINKR_DOMAIN = proxyBaseDomain;
		DynamoDB.mockImplementation(() => ({ putItem }));
	});

	it("Returns 404 if path not provided", async () => {
		const response = await handler({});

		expect(response).toEqual({
			statusCode: 404,
		});
	});

	it("Shortens a request successfully", async () => {
		const response = await handler(testEvent);

		expect(response).toEqual({
			body: JSON.stringify({ shortUrl: expectedShortUrl }),
			headers: { "Content-Type": "application/json" },
			statusCode: 200,
		});
	});

	it("Updates the shortUrl for the specified path", async () => {
		await handler(testEvent);

		expect(putItem).toBeCalledWith({
			TableName: proxyTable,
			Item: {
				shortUrl: { S: expectedShortUrl },
				longUrl: { S: longUrl },
			},
		});
	});
});
