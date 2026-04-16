# Backlog

Items are categorized as **Bug** or **Feature** and prioritized P0–P2.

- **P0** — Broken/blocking; fix before any public promotion
- **P1** — High impact; fix in next sprint
- **P2** — Enhancement; schedule when capacity allows

---

## Bugs

| ID | Priority | Description |
|----|----------|-------------|
| B01 | P0 | **Mobile hamburger menu off-screen** — Menu pushed off-screen to the right on mobile; viewport/overflow issue. Also audit xs font sizes and button sizes for mobile readability. |
| B02 | P0 | **NavBar not sticky on mobile scroll** — NavBar does not anchor to top of screen on mobile browsers. Root cause likely tied to `overflow-x: hidden` on `body` conflicting with `position: fixed` on iOS Safari. Fix together with B01. |
| B03 | P1 | **NavBar stuck on Projects hover state** — After visiting a project detail or NDA page and returning to Home, the NavBar remains in the Projects active/hover state and cannot reset. |
| B04 | P1 | **LinkedIn avatar images broken in Recommendations** — LinkedIn blocks cross-origin image requests. Images display as broken links. Fix: host avatars locally in `public/` and add initials icon fallback when image is unavailable. |
| B05 | P1 | **Recommendation card height jumps on expand/collapse** — Cards change height sporadically due to character-limit show/hide toggle. Fix: CSS `line-clamp` for truncation, fixed `min-height` per breakpoint, `max-height` CSS transition for smooth expand/collapse with no layout jump. |
| B06 | P1 | **Projects filter leaves empty space** — When filtering reduces the project count significantly, sections below do not always collapse upward to fill the space. Appears sporadic. |

---

## Features

| ID | Priority | Description |
|----|----------|-------------|
| F01 | P0 | **Favicon** — Add `.ico` file for browser tab. Currently showing default Next.js icon. |
| F02 | P1 | **Project detail page templates** — Build two layout templates driven by `mediaElements` data: (1) hero carousel layout, (2) article/blog layout. Unlocks NDA project content and removes password gates as content is added. |
| F03 | P1 | **Contact confirmation email to user** — Fix LinkedIn URL (currently hardcoded incorrectly); address user by first name only; add subject reminder ("I received your message regarding [subject]"); apply site color palette (accent header, white text); place logo left of name in header matching NavBar layout; add FA social icons in footer; sign-off "Respectfully,". Awaiting corporate logo asset from owner. |
| F04 | P1 | **Contact notification email to owner** — Correct `Submitted` timestamp from UTC to EST. Clarify: `ID` field is the DynamoDB primary key for lookup/reference — consider moving to a de-emphasized footer line. |
| F05 | P1 | **Email template branding** — Add corporate logo to both emails (asset to be provided by owner). Increase name font size in header. Replace profile description line with roles from Hero/Footer. Sign-off: "Respectfully,". |
| F06 | P2 | **GitHub social icon in Hero and Footer** — Add FA GitHub icon and link alongside existing social icons. **Blocked:** repo must be reviewed and made public-ready before link is exposed. |
| F07 | P2 | **Mobile UX audit** — Review and enlarge font sizes and interactive elements (buttons, links) for xs screen sizes beyond hamburger menu fix in B01/B02. |

---

## Future Expansion (Post-Launch)

- **Chatbot** — Conversational assistant for portfolio/resume Q&A
- **LinkedIn web scraping** — Auto-update Recommendations section from LinkedIn profile
- **CMS-driven content** — Dashboard for editing project/service/recommendation data without code deploys

---

## Repo Public-Readiness Checklist

Before making `portfolio-next` public and exposing GitHub link (F06):

- [ ] Review all commit messages for anything sensitive
- [ ] Confirm no secrets, keys, or credentials in any committed file
- [ ] Add meaningful `README.md` describing the project and tech stack
- [ ] Confirm `AGENTS.md` / `CLAUDE.md` content is appropriate for public view
- [ ] Remove or clean up `raw_assets/` if it contains anything not meant for public view
- [ ] Confirm all `.env*` files are gitignored (no `.env.local` accidentally committed)
