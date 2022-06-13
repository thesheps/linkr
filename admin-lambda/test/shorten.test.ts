import shorten from "../shorten";

describe("Shorten function", () => {
	it("Shortens the requested Url", () => {
		const url = "https://www.really-long-url.com";
		const baseDomain = "linkr.com";
		const shortUrl = shorten(url, baseDomain);

		expect(shortUrl).toBe("https://linkr.com/1fAu1D");
	});

	it("Throws an error on empty URL", () => {
		const url = "";
		const baseDomain = "linkr.com";
		const func = () => shorten(url, baseDomain);

		expect(func).toThrowError("The provided URL is empty!");
	});

	it("Throws an error on empty Base URL", () => {
		const url = "foobarbaz";
		const baseDomain = "";
		const func = () => shorten(url, baseDomain);

		expect(func).toThrowError("The provided base URL is empty!");
	});
});
