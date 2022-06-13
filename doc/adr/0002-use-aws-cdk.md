# 2. Use AWS CDK

Date: 2022-06-13

## Status

Accepted

## Context

We need a strategy for deploying the stack! Terraform, Pulumi, CFN are all mature options for doing this kind of work, but care should be taken so as not to introduce too many languages into this repository!

## Decision

AWS CDK is the framework of choice! It's got great support for typescript and provides a great backbone for being able to test-drive your infra.

## Consequences

AWS CDK evolves at a rate of knots. We should be looking to add outdated checks into our pipeline so that our code doesn't rot.
