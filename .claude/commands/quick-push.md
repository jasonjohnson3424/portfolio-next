Commit and push low-risk documentation or config changes directly to master — no branch required.

**Eligible paths (allowlist):**
- `*.md` files anywhere in the repo
- `.claude/commands/`
- `BACKLOG.md`, `CLAUDE.md`, `AGENTS.md`

---

1. Run `git diff --name-only` (staged and unstaged) to list every changed file.

2. Check each file against the allowlist above.
   - If any file falls outside the allowlist, stop and tell the user to use the full branch flow instead. Do not proceed.

3. Show the user the file list and recommend a commit message based on what changed. Ask the user to approve or edit the message before continuing.

4. Once the user approves or provides a commit message, proceed immediately — no further confirmation needed:
   - Stage only the eligible files by name (never `git add .` or `git add -A`)
   - Commit with the agreed message
   - Push to master

5. Report the result: commit hash, branch, and files pushed.
