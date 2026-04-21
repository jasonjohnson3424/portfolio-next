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

# Local-Only Files

`BACKLOG.md` lives at `C:\Users\jason\Documents\Apps\jasonljohnson-com_Personal-Portfolio\BACKLOG.md` — one level above the repo root, outside git scope. It is the sole project backlog and has no remote backup. Always read and write it at that path. Never place it inside the repo directory.

Never run `git rm` on any file without explicit user confirmation first. `git rm` permanently deletes from disk and index, bypasses the Windows Recycle Bin, and has no recovery path outside of git history. Always show the user exactly which files would be removed and wait for approval before executing.

When untracking a file with `git rm --cached`, always commit that change in isolation before any merge or checkout — never bundle it with other changes, as a fast-forward merge will sync the working tree and delete the file from disk.

# Filesystem Permission Boundary

Claude is permitted to read and write only within the project repository and the user's Apps directory.

All paths outside the repository — including the Claude memory folder — require explicit ad hoc permission before each access. Claude must ask before writing outside the permitted path, even when permission seems implied.
