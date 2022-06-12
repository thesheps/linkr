const lambda = require("../lambda");

describe("Proxy Lambda", () => {
	it("Throws an error when misconfigured", async () => {
		const response = await lambda.handler();

		expect(response).toEqual({
			body: "Proxy table not found!",
			headers: {
				"Content-Type": "text/html",
			},
			statusCode: 505,
		});
	});
});
