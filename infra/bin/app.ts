#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { PortfolioStack } from "../lib/portfolio-stack";
import { GithubOidcStack } from "../lib/github-oidc-stack";

const app = new cdk.App();

// Deploy once before PortfolioStack:  npx cdk deploy GithubOidcStack
new GithubOidcStack(app, "GithubOidcStack", {
  env: {
    account: "017820696429",
    region: "us-east-1",
  },
  githubOrg: "jasonjohnson3424",
  githubRepo: "portfolio-next", // UPDATE: your repo name
});

new PortfolioStack(app, "PortfolioStack", {
  env: {
    account: "017820696429",
    region: "us-east-1",
  },
  domainName: "jasonljohnson.com",
  apiSubdomain: "api.jasonljohnson.com",
  sesFromAddress: "contact@jasonljohnson.com",
  sestoAddress: "me@jasonljohnson.com",
});
