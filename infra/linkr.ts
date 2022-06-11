import { App, LegacyStackSynthesizer } from "aws-cdk-lib";

import { LinkrStack } from "./linkr-stack";

new LinkrStack(new App(), "Linkr", {
	linkrDomainName: process.env.LINKR_DOMAIN ?? "",
	linkrHostedZoneId: process.env.LINKR_HOSTED_ZONE_ID ?? "",
	synthesizer: new LegacyStackSynthesizer(),
});
