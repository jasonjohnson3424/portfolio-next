Add one or more entries to BACKLOG.md at the repo root.

Usage: `/backlog-add --id <B|F|C> --priority <P0|P1|P2> --title <text> --description <text>`

Multiple entries can be passed as a semicolon-delimited list in the args:
`b, p0, 'Title One', 'Desc one'; f, p1, 'Title Two', 'Desc two'`

- `--id`: Item type — `B` for Bug, `F` for Feature, `C` for Chore. The numeric ID is assigned automatically. Optional — if omitted, ask the user.
- `--priority`: Priority level — `P0`, `P1`, or `P2`. Optional — if omitted, ask the user.
- `--title`: Short label shown in bold. Optional — if omitted, ask the user.
- `--description`: Description of the item. Any length. Optional — if omitted, ask the user.

**Note:** BACKLOG.md is an HTML file. All rows are HTML `<tr>` elements, not Markdown table rows.

1. Resolve inputs:
   - If the args string contains semicolons, split on `;` to get individual entries. Parse each entry as `type, priority, 'title', 'description'`.
   - For a single entry, use any params provided via arguments above.
   - For any missing param on any entry, ask the user before proceeding.

2. Read BACKLOG.md **once** before processing any entries. Determine the next available ID for each type across all entries being added — increment sequentially so IDs don't collide (e.g. if B11 exists and two bugs are being added, assign B12 and B13).

3. Determine the CSS class based on type:
   - Open Bug → `class="open-bug"`
   - Open Feature → `class="open-feature"`
   - Open Chore → `class="open-chore"`

4. Format each new row as HTML:
   ```html
   <tr class="open-bug|open-feature|open-chore">
     <td class="id">B##</td>
     <td class="priority">P#</td>
     <td><strong>Title</strong> — Description</td>
   </tr>
   ```
   Do NOT add strikethrough or badges to new open items.

5. Insert each entry into the correct `<tbody>` section (Bugs, Features, or Chores) in priority order (P0 before P1 before P2). Insert before the first row whose priority is lower than the new item's priority, or at the end of the tbody if all existing open rows are equal or higher priority.

   When multiple entries go into the same section, insert them together in priority order relative to each other and existing rows.

6. Write the file once after all insertions — no confirmation needed. Do not commit.

7. Open BACKLOG.md in the IDE.
