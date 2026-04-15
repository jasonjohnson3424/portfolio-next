import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

interface GithubOidcStackProps extends cdk.StackProps {
  githubOrg: string;   // e.g. "jasonljohnson"
  githubRepo: string;  // e.g. "portfolio-next"
}

/**
 * One-time stack that creates the GitHub Actions OIDC provider and deploy role.
 * Deploy this ONCE before the main portfolio stack.
 *
 *   cd infra && npx cdk deploy GithubOidcStack
 */
export class GithubOidcStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: GithubOidcStackProps) {
    super(scope, id, props);

    const { githubOrg, githubRepo } = props;

    // GitHub's OIDC provider — only one per AWS account
    const provider = new iam.OpenIdConnectProvider(this, "GitHubOidcProvider", {
      url: "https://token.actions.githubusercontent.com",
      clientIds: ["sts.amazonaws.com"],
      thumbprints: ["6938fd4d98bab03faadb97b34396831e3780aea1"],
    });

    const deployRole = new iam.Role(this, "GitHubActionsDeployRole", {
      roleName: "GitHubActionsDeployRole",
      assumedBy: new iam.WebIdentityPrincipal(provider.openIdConnectProviderArn, {
        StringEquals: {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
        },
        StringLike: {
          "token.actions.githubusercontent.com:sub": `repo:${githubOrg}/${githubRepo}:*`,
        },
      }),
      description: "Role assumed by GitHub Actions for portfolio deployments",
      maxSessionDuration: cdk.Duration.hours(1),
    });

    // Permissions needed for CDK deploy + open-next + CloudFront invalidation
    deployRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("PowerUserAccess")
    );
    // CDK also needs IAM for role/policy creation in the portfolio stack
    deployRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "iam:CreateRole",
          "iam:DeleteRole",
          "iam:AttachRolePolicy",
          "iam:DetachRolePolicy",
          "iam:PutRolePolicy",
          "iam:DeleteRolePolicy",
          "iam:GetRole",
          "iam:PassRole",
          "iam:GetRolePolicy",
          "iam:ListRolePolicies",
          "iam:ListAttachedRolePolicies",
          "iam:TagRole",
          "iam:UntagRole",
          "iam:UpdateAssumeRolePolicy",
        ],
        resources: ["*"],
      })
    );

    new cdk.CfnOutput(this, "DeployRoleArn", {
      value: deployRole.roleArn,
      description: "Paste this ARN into .github/workflows/deploy.yml role-to-assume",
    });
  }
}
