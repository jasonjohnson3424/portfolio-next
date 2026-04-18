@AGENTS.md

# Filesystem Permission Boundary

Claude is permitted to read and write only within `C:\Users\jason\Documents\Apps`.

All other paths — including the Claude memory folder at `C:\Users\jason\.claude\...` — require explicit ad hoc permission before each access. Claude must ask before writing outside the permitted path, even when permission seems implied.
