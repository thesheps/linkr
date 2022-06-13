import { handler } from "../handler";

jest.mock("aws-sdk");
global.console.log = jest.fn();

const proxyTable = "beans-on-toast";
const proxyBaseDomain = "linkr.com";
const updateItem = jest.fn().mockReturnValue({ promise: jest.fn() });

describe("Admin Lambda", () => {
	const { DynamoDB } = require("aws-sdk");

	beforeEach(() => {
		process.env.LINKR_PROXY_TABLE_NAME = proxyTable;
		process.env.LINKR_DOMAIN = proxyBaseDomain;
		DynamoDB.mockImplementation(() => ({ updateItem }));
	});

	it("Returns 404 if path not provided", async () => {
		const response = await handler({});

		expect(response).toEqual({
			statusCode: 404,
		});
	});

	it("Shortens a request successfully", async () => {
		const response = await handler({
			httpMethod: "POST",
			path: "/entries",
			body: JSON.stringify({
				longUrl: "https://www.big-url.com/my-lovely-path",
			}),
		});

		expect(response).toEqual({
			body: JSON.stringify({ shortUrl: "https://linkr.com/1A95TU" }),
			headers: { "Content-Type": "application/json" },
			statusCode: 200,
		});
	});
});
