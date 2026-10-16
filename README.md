# Jason L. Johnson — Portfolio

Personal portfolio site for Jason L. Johnson, a Learning & Development Manager, Instructional Designer, and Web Developer.

## Tech Stack

- **Frontend:** Next.js 16, React, Bootstrap, and Sass
- **Infrastructure:** AWS CDK, CloudFront, S3, Lambda, API Gateway, DynamoDB
- **Build/Deploy:** OpenNext, GitHub Actions (OIDC)

## Architecture

Monorepo with two workspaces:
- `app/` — Next.js frontend
- `infra/` — AWS CDK stack

Deployed as a static/serverless site on AWS via OpenNext. Contact form backed by Lambda + DynamoDB. NDA project content gated via server-side password verification through SSM Parameter Store.

## Set up a new development machine

1. Install Git, Docker Desktop, VS Code, and a Node version manager.
2. Clone this repository and install the Node version declared in `.nvmrc` (Node 22.13.0).
3. Copy `app/.env.example` to `app/.env.local`, then restore the two environment values from your secure backup. Never commit `.env.local`.
4. Install dependencies:

   ```powershell
   Set-Location app
   npm ci
   Set-Location ../infra
   npm ci
   ```

5. Open the repository root in VS Code. Accept the recommended extensions, or choose **Dev Containers: Reopen in Container** for the reproducible container setup.
6. Start the site from the repository root with the VS Code task **app: dev**, or run:

   ```powershell
   Set-Location app
   npm run dev
   ```

The repository includes shared VS Code settings and tasks under `.vscode/`. Personal preferences, keybindings, snippets, and the rest of your extension list should be restored through VS Code Settings Sync after signing in on the new PC with the same account.

## Migration checklist

- Confirm the latest local commit is present on `origin/main`.
- Securely transfer `app/.env.local`; it is intentionally excluded from Git.
- Confirm any required AWS credentials or SSO configuration on the new PC. Credentials must not be committed.
- In VS Code, turn on Settings Sync for Settings, Keyboard Shortcuts, Extensions, User Snippets, and Profiles.
- Run `npm run lint` and `npm run build` from `app/` before retiring the old PC.
