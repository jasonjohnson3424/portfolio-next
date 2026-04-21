Mark a BACKLOG.md item complete or deferred.

Usage: `/backlog-close --id <ID> --comment <text>`

- `--id`: The item ID to close (e.g. B03, F07). Optional — if omitted, read BACKLOG.md, show open items, and prompt the user to pick one.
- `--comment`: Text to append to the item's description. Optional.

**Note:** BACKLOG.md lives one level above the repo root (outside git scope). Open items have class `open-bug`, `open-feature`, or `open-chore`. Completed items have class `complete`. Deferred items have class `deferred`.

1. Resolve the item ID:
   - If `--id` was provided, use it.
   - Otherwise read BACKLOG.md, list all open items (ID + title), and ask the user which one to close.

2. Ask whether to mark it **complete** or **deferred** — unless context makes it obvious.

3. Read BACKLOG.md and locate the `<tr>` by its ID cell.

4. Apply changes to that row:
   - Change the `class` attribute on `<tr>` to `"complete"` or `"deferred"`.
   - Append the badge to the end of the description `<td>`:
     - Complete → `<span class="badge">✅ Complete</span>`
     - Deferred → `<span class="badge">⛔ Deferred</span>`
   - If `--comment` was provided, append ` — <comment text>` immediately before the badge (inside the same `<td>`).
   - Do NOT add strikethrough or alter any other description text.

5. Write the file directly — no confirmation needed.

6. Do not commit.

7. Open BACKLOG.md in the IDE.
