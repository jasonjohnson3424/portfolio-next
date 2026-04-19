Add a new entry to BACKLOG.md at the repo root.

**Note:** BACKLOG.md is an HTML file. All rows are HTML `<tr>` elements, not Markdown table rows.

1. Ask the user for:
   - Type: Bug, Feature, or Chore
   - Priority: P0, P1, or P2
   - Title (short, bold label)
   - Description (one sentence)

2. Read BACKLOG.md to find the next available ID for that type:
   - Bugs are B01, B02... → next unused number
   - Features are F01, F02... → next unused number
   - Chores are C01, C02... → next unused number

3. Determine the CSS class based on type:
   - Open Bug → `class="open-bug"`
   - Open Feature → `class="open-feature"`
   - Open Chore → `class="open-chore"`

4. Format the new row as HTML:
   ```html
   <tr class="open-bug|open-feature|open-chore">
     <td class="id">B##</td>
     <td class="priority">P#</td>
     <td><strong>Title</strong> — Description</td>
   </tr>
   ```
   Do NOT add strikethrough or badges to new open items.

5. Insert it into the correct `<tbody>` section (Bugs, Features, or Chores) in priority order (P0 before P1 before P2). Insert before the first row whose priority is lower than the new item's priority, or at the end of the tbody if all existing open rows are equal or higher priority.

6. Confirm the entry with the user before writing.

7. Write the file. Do not commit.
