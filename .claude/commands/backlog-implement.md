Pick a backlog item and set up to implement it.

1. If the user provided an ID (e.g. `/backlog-implement F03`), use that item.
   Otherwise, read BACKLOG.md and recommend the highest-priority open item, show its full description, and ask the user to confirm or pick a different ID.

2. Once an item is confirmed, derive the branch name from its ID and title:
   - Bug (B##) → `fix/B##-short-desc`
   - Feature (F##) → `feature/F##-short-desc`
   - Chore (C##) → `chore/C##-short-desc`
   Slugify the title: lowercase, hyphens, max ~30 chars after the ID.

3. Show the user the exact branch name and ask for approval before running any git command.

4. On approval, run:
   ```
   git checkout master && git pull && git checkout -b <branch-name>
   ```

5. Read any files most relevant to the item and briefly summarize:
   - What already exists that relates to this item
   - What needs to be created or changed
   - Suggested first step

6. Do not write any code, create files, or commit anything — just orient the user so they can start.
