Review BACKLOG.md and help the user decide what to work on next.

**Note:** BACKLOG.md is an HTML file. Open items have class `open-bug`, `open-feature`, or `open-chore`. Completed items have class `complete`. Deferred items have class `deferred`.

1. Read BACKLOG.md.

2. Scan for any items that appear to be completed (e.g. already merged, confirmed working, or marked done in conversation context):
   - If you are confident an item is complete, update its row in BACKLOG.md:
     - Change the `class` attribute to `"complete"`
     - Append `<span class="badge">✅ Complete</span>` to the end of the description `<td>`
     - Do NOT add strikethrough or alter the description text — the CSS class drives all styling (green ID/priority, gray description text, ✅ badge)
   - If you are unsure whether an item is complete, ask the user before marking it.
   - Do not mark items complete based on backlog description alone — only when there is clear evidence.
   - For deferred items (not going to implement, kept for record): change class to `"deferred"`, append `<span class="badge">⛔ Deferred</span>`. Do NOT add strikethrough.

3. Print a summary grouped by type (Bugs, Features, Chores), sorted by priority within each group:
   - Show ID, priority, and title only (no full description) to keep it scannable.
   - Prefix each line with a priority badge: 🔴 P0 / 🟡 P1 / 🟢 P2.
   - Skip already-completed and deferred items.

4. After the summary, recommend the single highest-priority item to tackle next. Base the recommendation on:
   - Priority (P0 first)
   - Type bias: if the user's current branch name contains a type hint (fix/, feature/), prefer matching type
   - Briefly explain why you chose it (one sentence)

5. Ask the user if they want to:
   a. Start working on the recommended item (hand off to /backlog-implement)
   b. Pick a different item by ID
   c. Just review — no action needed

6. Do not commit anything.
