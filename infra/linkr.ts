import { App, LegacyStackSynthesizer } from "aws-cdk-lib";

import { LinkrStack } from "./linkr-stack";

const linkrDomainName = process.env.LINKR_DOMAIN ?? "";
const linkrHostedZoneId = process.env.LINKR_HOSTED_ZONE_ID ?? "";

if (!linkrDomainName || !linkrHostedZoneId)
	throw new Error("Environment not configured!");

new LinkrStack(new App(), "Linkr", {
	linkrDomainName,
	linkrHostedZoneId,
	synthesizer: new LegacyStackSynthesizer(),
});
