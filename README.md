# Jason L. Johnson — Portfolio

Personal portfolio site for Jason L. Johnson, a Learning & Development Manager, Instructional Designer, and Web Developer.

## Tech Stack

- **Frontend:** Next.js 16 (App Router), React, Tailwind CSS
- **Infrastructure:** AWS CDK, CloudFront, S3, Lambda, API Gateway, DynamoDB
- **Build/Deploy:** OpenNext, GitHub Actions (OIDC)

## Architecture

Monorepo with two workspaces:
- `app/` — Next.js frontend
- `infra/` — AWS CDK stack

Deployed as a static/serverless site on AWS via OpenNext. Contact form backed by Lambda + DynamoDB. NDA project content gated via server-side password verification through SSM Parameter Store.
