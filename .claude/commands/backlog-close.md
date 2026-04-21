Mark a backlog item as complete in BACKLOG.md.

**Note:** BACKLOG.md lives at `C:\Users\jason\Documents\Apps\jasonljohnson-com_Personal-Portfolio\BACKLOG.md` — outside the repo. Always read/write it at that path.

**Note:** BACKLOG.md is an HTML file. All rows are HTML `<tr>` elements.

---

1. **If no identifier was provided**, read BACKLOG.md, print all open items (ID, priority, title only — no full descriptions), and ask the user which one to close. Wait for their response before proceeding.

2. **If an identifier was provided** (e.g. `F02`, `B08`, `C11`), proceed directly.

3. Read BACKLOG.md and locate the `<tr>` with the matching ID.
   - If not found, tell the user and stop.
   - If already marked complete or deferred, tell the user and stop.

4. Update the row in BACKLOG.md immediately — no confirmation prompt needed:
   - Change the `class` attribute to `"complete"`
   - Append `<span class="badge">✅ Complete</span>` to the end of the description `<td>`
   - If a comment was provided, append it before the badge: ` [comment] <span class="badge">✅ Complete</span>`
   - Do NOT add strikethrough or alter the existing description text

5. Write the file immediately without asking for write permission. Do not commit.
