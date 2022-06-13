import shorten from "../shorten";

describe("Shorten function", () => {
	it("Shortens the requested Url", () => {
		const url = "https://www.really-long-url.com";
		const shortUrl = shorten(url);

		expect(shortUrl).toBe("/1fAu1D");
	});

	it("Throws an error on empty URL", () => {
		const url = "";
		const func = () => shorten(url);

		expect(func).toThrowError("The provided URL is empty!");
	});
});
