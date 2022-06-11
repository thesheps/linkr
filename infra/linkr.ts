import { App, LegacyStackSynthesizer } from "aws-cdk-lib";

import { LinkrStack } from "./linkr-stack";

new LinkrStack(new App(), "Linkr", { synthesizer: new LegacyStackSynthesizer() })