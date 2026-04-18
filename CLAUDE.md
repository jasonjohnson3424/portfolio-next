@AGENTS.md

# Branching Convention

All work — bugs, features, and chores — must be done on a short-lived branch, never directly on `master`.

**Naming pattern:**
- Bug fix: `fix/<ID>-short-desc` (e.g. `fix/B03-navbar-hover-state`)
- Feature: `feature/<ID>-short-desc` (e.g. `feature/F02-project-detail-templates`)
- Docs/chore: `chore/short-desc` (e.g. `chore/update-backlog`)

**Flow:**
1. `git checkout -b <branch-name>` — branch off master
2. Do the work and commit
3. `git checkout master && git merge <branch-name>` — fast-forward merge
4. `git branch -d <branch-name>` — delete branch
5. `git push`

Never resolve merge conflicts by accepting all incoming or all current on a whole file — resolve hunk by hunk and run `git diff HEAD` before committing.

# Filesystem Permission Boundary

Claude is permitted to read and write only within `C:\Users\jason\Documents\Apps`.

All other paths — including the Claude memory folder at `C:\Users\jason\.claude\...` — require explicit ad hoc permission before each access. Claude must ask before writing outside the permitted path, even when permission seems implied.
