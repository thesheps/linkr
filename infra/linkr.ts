import { App, LegacyStackSynthesizer } from "aws-cdk-lib";

import { LinkrStack, LinkrStackProps } from "./linkr-stack";

const props: LinkrStackProps = {
	linkrTableName: "linkr-entries",
	linkrDomainName: process.env.LINKR_DOMAIN ?? "",
	linkrHostedZoneId: process.env.LINKR_HOSTED_ZONE_ID ?? "",
	defaultRedirect: process.env.DEFAULT_REDIRECT ?? "",
};

if (!Object.values(props).every((p) => p))
	throw new Error("Environment not configured!");

new LinkrStack(new App(), "Linkr", {
	...props,
	synthesizer: new LegacyStackSynthesizer(),
});
