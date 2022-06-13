import shorten from "../shorten";

describe("Shorten function", () => {
	it("Shortens the requested Url", () => {
		const url = "https://www.really-long-url.com";
		const baseLinkUrl = "https://linkr.com";
		const shortUrl = shorten(url, baseLinkUrl);

		expect(shortUrl).toBe("https://linkr.com/1fAu1D");
	});

	it("Throws an error on empty URL", () => {
		const url = "";
		const baseLinkUrl = "https://linkr.com";
		const func = () => shorten(url, baseLinkUrl);

		expect(func).toThrowError("The provided URL is empty!");
	});

	it("Throws an error on empty Base URL", () => {
		const url = "foobarbaz";
		const baseLinkUrl = "";
		const func = () => shorten(url, baseLinkUrl);

		expect(func).toThrowError("The provided base URL is empty!");
	});
});
