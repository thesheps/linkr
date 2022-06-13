import base62 from "base62";
import md5 from "md5";

export default function shorten(url: string, baseDomain: string) {
	if (!url) throw new Error("The provided URL is empty!");
	if (!baseDomain) throw new Error("The provided base URL is empty!");

	const hash = md5(url);
	const size = hash.length;
	const x = hash.substring(0, size / 3);
	const y = hash.substring(size / 3, (size / 3) * 2);
	const z = hash.substring((size / 3) * 2, (size / 3) * 3);
	const shortened = parseInt(x, 16) ^ parseInt(y, 16) ^ parseInt(z, 16);
	const shortCode = base62.encode(Math.abs(shortened));

	return `https://${baseDomain}/${shortCode}`;
}
