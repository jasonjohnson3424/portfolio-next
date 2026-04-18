Review BACKLOG.md and help the user decide what to work on next.

1. Read BACKLOG.md.

2. Print a summary grouped by type (Bugs, Features, SEO), sorted by priority within each group:
   - Show ID, priority, and title only (no full description) to keep it scannable.
   - Prefix each line with a priority badge: 🔴 P0 / 🟡 P1 / 🟢 P2.

3. After the summary, recommend the single highest-priority item to tackle next. Base the recommendation on:
   - Priority (P0 first)
   - Type bias: if the user's current branch name contains a type hint (fix/, feature/), prefer matching type
   - Briefly explain why you chose it (one sentence)

4. Ask the user if they want to:
   a. Start working on the recommended item (hand off to /backlog-implement)
   b. Pick a different item by ID
   c. Just review — no action needed

5. Do not write any files. Do not commit anything.
