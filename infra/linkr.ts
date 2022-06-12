import { App, LegacyStackSynthesizer } from "aws-cdk-lib";

import { LinkrStack } from "./linkr-stack";

const linkrDomainName = process.env.LINKR_DOMAIN ?? "";
const linkrHostedZoneId = process.env.LINKR_HOSTED_ZONE_ID ?? "";
const defaultRedirect = process.env.DEFAULT_REDIRECT ?? "";

if (!linkrDomainName || !linkrHostedZoneId || !defaultRedirect)
	throw new Error("Environment not configured!");

new LinkrStack(new App(), "Linkr", {
	linkrDomainName,
	linkrHostedZoneId,
	defaultRedirect,
	synthesizer: new LegacyStackSynthesizer(),
});
