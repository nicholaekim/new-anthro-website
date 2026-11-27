# Site Restyle Plan: "Archive room"

**Goal:** make the finished site look composed and deliberate without changing what it says or how it behaves. The site owner chose the direction "Archive room": calm and museum-like, a warm dark room, documents on cream paper with soft shadows, an elegant serif for titles, generous spacing, thin rules and small labels.

**Spec:** `design-plan.md`, section 4 (Visual design) and section 5 (User experience). Earlier plans in this folder still bind: their Global Constraints are restated below where they matter.

All paths are relative to `site/`.

## What the site is, in one paragraph

A reader moves through four chapters. Each chapter sets real documents (census instructions, statutes, forms) beside reasoning about one fictional person. The documents and quotations are the evidence; the site's own text is commentary. The look must keep those two voices visibly apart, make long reading comfortable, and give the documents the weight of objects laid out for study. It is a place for slow reading, not a landing page.

## Design direction

- **Tone:** quiet, editorial, archival. Restraint over decoration. Nothing glossy, no gradients except the one soft light the backdrop already has, no rounded "app" cards, no drop caps, no icons for their own sake.
- **Memorable detail:** documents sit on the dark surface as sheets of paper with a soft, low shadow and a hairline edge, and each section opens with a small numbered label above a serif heading and a thin rule, like a catalogue entry.
- **Hierarchy:** one large title per page (the only very large type); section headings clearly smaller; labels small, uppercase and letter-spaced; body text at a comfortable reading size with a measure of about 60 to 72 characters.

## Tokens (edit `src/app/globals.css`, `@theme static`)

Keep the existing role names and add what is missing. Values may be tuned by eye, but keep the roles.

| Token | Role | Starting value |
|---|---|---|
| `--color-surround` | the dark room | `#191713` |
| `--color-raised` (new) | header, beat bar, dialogs' surround | `#221f1a` |
| `--color-paper` | sourced items | `#efe9dc` |
| `--color-sheet` | the site's own sheets (outcome): a visibly different, cooler stock | `#e2e7e9` |
| `--color-ink` | text on paper and sheet | `#1f1d1a` |
| `--color-ink-soft` (new) | secondary text on paper and sheet (labels, citations) | `#57514a` |
| `--color-muted` (new) | secondary text on the dark surround | `#aaa396` |
| `--color-rule` (new) | hairlines on the dark surround | paper at about 18% |
| `--color-interface` | navigation, ticks, focus ring: an old-brass neutral, never the reserved colour | `#b8a47a` |
| `--color-reserved` | only the outcome mark in beat 5 | unchanged `#c2410c` |

Every text and background pair must reach a contrast ratio of at least 4.5 to 1 (3 to 1 for the page title and other type of 24 pixels or more). Check the pairs you use and list them in your report.

## Type

The four families stay: Fraunces (title), Source Serif 4 (the site's own voice), IBM Plex Mono (source voice), Inter (interface). You may change which weights, styles or axes `next/font` loads in `src/app/layout.tsx`. No other family.

- **Page title (`h1`):** Fraunces, fluid size (about 2.5rem on phones to 4.5rem on wide screens), tight leading, slightly negative tracking. It must keep the class `font-title` (a test checks it) and stay inside the existing `Reveal` component unchanged.
- **Section headings (`h2`):** Fraunces, about 1.5 to 1.75rem.
- **Section label:** a small line above each chapter section heading with the beat number and nothing else new, for example `02`, in Inter, uppercase, letter-spaced, in the muted colour. It is decoration: mark it `aria-hidden`, because the heading already names the section.
- **Own voice:** Source Serif 4, about 1.0625 to 1.125rem, line height about 1.65, measure 60 to 72 characters.
- **Source voice:** IBM Plex Mono, slightly smaller than body, line height about 1.6. Only quoted source words use it, as now. Never set the site's own words in it.
- **Interface:** Inter. Field labels (`dt`), status labels, the place-and-date tag and control labels are small, uppercase where short, letter-spaced.

## Surfaces and components

Read each component before changing it. Change classes and CSS; add a wrapper or a decorative `aria-hidden` element only where a treatment needs one.

1. **Header (`src/app/layout.tsx`) and beat bar (`BeatTicks`):** slim, on `--color-raised`, with a hairline rule toward the page. Keep their heights as they are now, because other rules depend on them (see "Things that must not move"). Controls read as quiet text buttons with a clear hover and focus state. The current beat's tick is visibly distinct.
2. **Place-and-date tag (`PlaceDateTag`):** small uppercase label with a hairline.
3. **Chapter card (beat 1):** a title page. Tall, with the title low in the frame, the country and year as a quiet line, and the content note set apart in a hairline box with its "Content note" label styled as a label.
4. **Section openings (beats 2 to 8):** numbered label, heading, thin rule, then content, with generous vertical rhythm between sections.
5. **Items (`ItemView`, `Mount`, `StatusLabel`, `Disclosure`):** a sheet of paper: `--color-paper`, a soft low shadow, a hairline edge, roomy padding. The image sits in a mat with a thin keyline. Status label: small outlined text label (the words stay). Field labels as small uppercase labels in `--color-ink-soft`. Transcription: source voice, on a slightly darker paper tint with a rule at the left. Annotations: numbered, hanging numerals. "Open close view" and "Large image": a clear text-button style. Provenance disclosure: a quiet summary row that reads as openable.
6. **Empty frames:** a calm dashed frame with the note centred in `--color-ink-soft`; it must still read as "nothing here on purpose".
7. **Basis (beat 4) and present-day basis:** the quotation is the largest source-voice text on the page, set off by a rule at the left; its citation small, in the interface voice.
8. **Outcome (beat 5) and present-day outcome:** on the `--color-sheet` stock so it never passes for a source, with the reserved-colour mark exactly as now. Confidence and citation as labelled lines.
9. **Change of date (beat 6):** the stage keeps its geometry. Style the frame, captions and the era switch only.
10. **Person card (`PersonCardView`, `Backdrop`):** an index card: paper, a thin rule between facts, small uppercase fact labels, the reason line smaller in `--color-ink-soft`. A fact in use is marked by a solid bar at its left edge and a slightly stronger label, not by an outline box.
11. **Opening page:** a title page: the title large, the framing as a lead paragraph slightly larger than body, the person card centred within its existing light and border, the note on language quieter, and "Begin" as the one prominent control on the page (an outlined button in paper on dark, not the reserved colour).
12. **Ending page:** each note a section with its heading and a rule; outcomes summarised as small sheets; bibliography and credits in a smaller size with comfortable line spacing. The note paragraphs must keep the class `whitespace-pre-line` (a test checks it).
13. **Close view (`CloseView`):** the dialog reads as a larger sheet on a dimmed room.
14. **Links, focus, selection:** links underlined with an offset; hover shifts colour; focus ring 2px in `--color-interface` with offset, visible on dark and on paper; a matching text-selection colour; a thin dark scrollbar where the browser supports `scrollbar-color`.
15. **Below 1024 pixels:** one column, comfortable side padding, and enough space at the top of each chapter section that the fixed "Person card" button and the place-and-date tag never sit on a heading. Check 375 and 320 wide.

## Things that must not move

- **Content and meaning:** no change to `src/content/**`, no new or reworded text other than the numeric section labels, no change to heading levels, landmark roles, `id`s, `aria-*`, `data-*` attributes or the order of elements.
- **Motion:** no change to `src/motion/**` behaviour. Add no CSS transition or animation; hover and focus states change instantly. No CSS state hides content (the one existing `data-motion-pending` rule stays as it is).
- **Pinned sections:** `globals.css` sizes the pinned beat 6 from the header and beat-bar heights (`calc(100svh - 4.5rem)`, `7rem` on touch) and caps the beat 2 photograph (`calc(100svh - 12rem)`); `scroll-padding` values depend on the same heights. If you change any of those heights or the padding around beat 2's heading, update every dependent value and re-measure.
- **Person card column:** at 1024 pixels and wider it is fixed, 18rem wide, between the header and the beat bar, and scrolls inside itself. Chapter content must not run under it.
- **Representation rules from `design-plan.md`:** the 2020 material is not styled brighter, cleaner or lighter than the historical material; the light belongs to the backdrop and never sits over an item or text; the reserved colour appears only on the outcome mark; no artificial ageing, texture or stamp effects on documents; status labels stay plain words.
- **No new dependency.** TypeScript strict, no `any`, no `@ts-ignore`.
- **Tests:** `npm test`, `npm run lint` and `npm run build` must pass. Do not change a test to make it pass unless it asserts a class name this plan tells you to replace, and say so if you do.

## Steps

- [ ] 1. Read `src/app/globals.css`, `src/app/layout.tsx`, every file in `src/components/` and `src/components/beats/`, `src/app/page.tsx`, `src/app/ending/page.tsx`. Note the class names tests assert (`font-title`, `whitespace-pre-line`).
- [ ] 2. Tokens and base typography in `globals.css`; font loading in `layout.tsx`.
- [ ] 3. Shared pieces: section opening (label, heading, rule), sheet, mat, field label, text button. Prefer a few `@utility` or component classes in `globals.css` over repeating long class lists.
- [ ] 4. Chapter page top to bottom, then the person card, the opening page, the ending page, the close view.
- [ ] 5. Run `npm test`, `npm run lint`, `npm run build`.
- [ ] 6. Look at it: serve the production build and check, at 1280 by 800 and at 375 by 812, the opening page, one full chapter, the Tobique chapter (empty frames, no person card) and the ending page. Confirm both pins still fit, no page scrolls sideways, focus is visible on every control (Tab through one page), and nothing overlaps. Fix what you find.
- [ ] 7. Commit `style: archive-room restyle` (no attribution lines). Update the "Interface labels" section of `/README.md` if you added visible labels.

## Report

What you changed and where; the colour pairs and their contrast ratios; anything in this plan you chose not to do and why; anything you noticed but left alone; what you looked at in the browser and what you could not check.
