# 1. Use serverless technologies

Date: 2022-06-12

## Status

Accepted

## Context

URL shortening services need:

- APIs
- UIs
- Databases

These items can be prohibitively expensive for someone wanting to set build their own website and participate in the IndieWeb. A decision needs to be made to figure out how best to cut some of these costs.

## Decision

The decision has been made to pursue native AWS technologies to try and reduce spend! AWS API Gateway, Lambda, DynamoDB and Cloudfront are the current technologies of choice which should allow a low financial barrier to entry and initial PoC development.

## Consequences

Just because we have adopted serverless technologies as part of this framework does _not_ necessitate that the framework will scale! As the capabilities are rolled out, we need to make sure that forecasted spend does not begin to spiral, and that performance remains at a suitable level. Fitness Functions will be written to express this challenge over the coming weeks and months.

**Important**: This stack is super opinionated about hosting providers (AWS). This is intentional, but means that there is vendor lock-in 🤷
