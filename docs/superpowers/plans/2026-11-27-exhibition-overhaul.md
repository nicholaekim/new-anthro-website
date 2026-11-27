# Exhibition Overhaul Plan

**Goal:** turn the finished, restyled site into an interactive historical exhibition: a guided story with a signature "then and now" comparison, documents you can inspect, a person card that responds to the story, clear navigation, and an ending that compares the four places. The site owner authorised the full overhaul and asked for it to be implemented, not proposed.

**Stack:** unchanged. Next.js 16 App Router, React 19, TypeScript strict, Tailwind 4, GSAP 3.15 (ScrollTrigger, SplitText, CustomEase already registered in `src/motion/gsap.ts`; other plugins that ship in the `gsap` package, such as Draggable, Observer, Flip and ScrollToPlugin, may be registered there if a task needs them). Add no other dependency unless a task cannot reasonably be done without it, and say why in the report.

All paths are relative to `site/` unless they start with `/`.

Read before working: `/README.md`, `AGENTS.md` (this Next.js version differs from older ones; check `node_modules/next/dist/docs/` when unsure), `src/app/globals.css`, and the files your task names.

## What exists (audit, 27 November 2026)

- Six prerendered pages: `/` (opening), `/chapters/{louisiana,sao-paulo,johannesburg,tobique}`, `/ending`.
- A chapter is eight "beats" in `src/components/beats/`: 1 chapter card, 2 place photograph (pinned at 1024px and wider), 3 items, 4 basis, 5 outcome, 6 change of date (pinned; cross-fades the historical and 2020 documents; `EraSwitch` button), 7 present day, 8 close. Tobique has no beat 5 and no person card.
- Content is typed data in `src/content/` (`types.ts`, `chapters/*.ts`, `person.ts`, `pages.ts`). Text was written from cited sources and checked; eleven real images are in `public/images/`. A few `slot("…")` placeholders remain on purpose where an image is deliberately absent.
- Motion is a layer in `src/motion/`: `MotionProvider` (mode `full` or `still`; `still` when the system asks for reduced motion or the reader turns the Motion switch off), title reveals (`Reveal`), an opening sequence, a cover between pages, and the two pins. GSAP set-ups use `useGSAP` with `gsap.matchMedia()` and the `context.ignore` pattern; copy that pattern.
- Look: "Archive room" tokens and utilities in `globals.css` (`leaf`, `mat`, `caps`, `soft`, `quiet`, `opening`, `beat`, `measure`, type utilities). `BeatHeading` draws each section opening.
- Weak points this plan fixes: nothing shows where you are in a chapter; the beat bar wraps to three rows on phones; the person card is static; beat 6 is only a cross-fade; the close view only enlarges the image; beat 2's parallax layers are grey placeholder blocks; the ending is long text.

## Rules that hold for every task

**Truth and sources**
- Do not write new historical claims, quotations, citations, credits or dates. New visible text is interface text (labels, instructions) or the short structured summaries given verbatim in Task 1. If you believe content is wrong, report it; do not rewrite it.
- Do not edit the wording of existing content strings. Task 3 may split a transcription into original and translation without changing a word.
- No generated, drawn or retouched images. Sourced images are never cropped, distorted, recoloured or moved inside their frames by default. A reader zooming, panning or wiping an image in a control they operate is fine, as long as the whole image is shown at rest and in the still version.
- Tobique names a living First Nation community: no person card, no outcome, no photograph, no hypothetical person, in any new component. Where a new feature shows outcomes or card facts, Tobique shows the system only and says a person is not placed there.
- No physical description of the fictional person anywhere. Historical racial terms appear only inside quotation marks as a source's wording, never in interface text.
- The 2020 material is not styled brighter, cleaner or lighter than the historical material. The reserved colour (`--color-reserved`) stays on the outcome mark only. Confidence is never shown by colour alone.

**Progressive enhancement and motion**
- The server-rendered page must be complete and readable without scripts: every document, both eras, every text. A feature may hide or rearrange content only after its script has run, and must leave everything reachable.
- Two modes. In `still` mode nothing animates over time: no tweens, no scroll-linked animation, no CSS transitions; state changes are instant. Interactive controls still work. In `full` mode use GSAP for anything choreographed. CSS transitions are allowed only for small hover and focus feedback and only when `html` carries `data-motion="full"` (Task 1 adds that attribute).
- Prefer animating `transform` and `opacity`. `clip-path` is allowed for the comparison wipe in Task 2. Never animate layout properties in a loop; nothing loops or autoplays.
- Every GSAP set-up is created in `useGSAP` and reverts cleanly on unmount, on a mode change and on a breakpoint change. No inline start values left behind in `still` mode.
- Pins only at 1024px and wider, as now (`MOTION_QUERY`). Below that everything is a readable single column.

**Accessibility**
- Every control is a real `button`, `a`, `input` or `summary`, reachable by keyboard, with a visible focus ring and an accessible name. Minimum target 24 by 24 CSS pixels, 44 on touch (`target` utility).
- No custom key handling on the page itself (arrow, space and page keys must keep scrolling). Key handling is allowed inside a focused widget: a native range input, a dialog, or a viewer region with `role="application"` or `role="group"` and written instructions.
- State is exposed: `aria-current`, `aria-pressed`, `aria-expanded`, `aria-valuetext`, and a polite live region where a change would otherwise be silent. Do not move focus unless the reader asked for it.
- Text contrast at least 4.5 to 1 (3 to 1 for type of 24px and larger, focus rings and control boundaries).
- No horizontal scrolling at 320px wide. No console errors.

**Engineering**
- TypeScript strict; no `any`, no `@ts-ignore`. Keep components small; put arithmetic in pure functions with unit tests written first (see them fail, then pass). Tests assert behaviour, not class names.
- Layout numbers that depend on the header and story-bar heights live together in `globals.css` with a comment; if you change a height, change every dependent value and re-measure the pins.
- Update a test only when the behaviour it pins is changed by this plan, and say so in your report.
- Each task ends with `npm test`, `npm run lint`, `npm run build` passing, a look at the built site (serve on port 3460, stop it afterwards) at 1280 by 800, 768 by 1024 and 375 by 812 in both modes, and one commit with a plain message and no attribution lines. Do not push. Commit only files under `site/` and `/README.md`.
- A hook in this repository refuses the first edit of each file once and asks for facts (importers, what changes, the user's instruction); state them briefly and retry. It may refuse a first shell command once. Never disable it. The user's instruction, verbatim: "ues fable to plan and opus ot implment", with a brief asking for the full overhaul to be implemented.

## Task 1: Foundation, story navigation and the person card

**Content model (`src/content/types.ts`, chapter files, tests)**

Add, with these exact values:

```ts
export type ConfidenceLevel = "high" | "moderate" | "low" | "undetermined";
// Outcome gains: level: ConfidenceLevel
export interface EraSummary { decides: Text; evidence: Text }
// Chapter gains: summary: { historical: EraSummary; present: EraSummary }
// Item gains: translation: Text | null        (used by Task 3)
// Basis gains: quoteTranslation: Text | null  (used by Task 3)
```

| Chapter | Era | `level` | `decides` | `evidence` |
|---|---|---|---|---|
| Louisiana | 1930 | high | The census enumerator | Ancestry, whatever the share |
| Louisiana | 2020 | moderate | The person, or whoever fills in the household’s form | Self-identification; the Census Bureau classifies what is written |
| São Paulo | 1950 | low | A declarant, often the head of the family; a coder then matches the word against a list | A declared word; no ancestry, standing or papers asked |
| São Paulo | 2020 | moderate | Whoever is interviewed: the person, another resident or a non-resident informant | A declaration among five read-out options |
| Johannesburg | 1955 | undetermined | The Director of Census; on objection, a board | Appearance, general acceptance and, for one category, membership “in fact” |
| Johannesburg | 2020 | low | The employee, on a workplace form; the employer if the employee refuses or gives inaccurate information | Self-declaration; failing that, “reliable historical and existing data” |
| Tobique | 1960 | (no outcome) | The Registrar, a federal officer; one reference to a judge | Recorded descent through men, band membership and marriage |
| Tobique | 2020 | (no outcome) | The Registrar, on application | Descent through either parent; credible evidence where an ancestor is unknown or unstated |

Set `translation: null` and `quoteTranslation: null` everywhere for now. Create `src/content/regions.ts` exporting an empty, typed record (another agent fills it):

```ts
export interface Highlight { id: string; label: string; region: { x: number; y: number; w: number; h: number }; annotationIds: string[] } // region in fractions of the image, 0 to 1
export const highlights: Record<string, Highlight[]> = {};
```

Extend `content.test.ts` and `validate.ts` for the new fields (levels are one of the four values; summaries are text, not placeholders; a highlight's annotation ids exist on its item).

**Motion attribute.** `MotionProvider` (and the inline pre-paint script in `src/motion/pending.ts`, which already resolves the mode) set `data-motion="full"` or `"still"` on `html`, so CSS can gate hover transitions.

**Where am I.** A client hook and provider (`src/components/StoryProgress.tsx` or similar) that tracks the active beat of the chapter and the chapter's scroll progress, in both modes and at every width. Put the "which section is active" rule in a pure, tested function (given section tops and a reading line, the active section is the last one whose top is at or above the line; the first before any is reached). Expose `activeBeat` to the story bar and the person card, and set `data-active-beat` on the `[data-chapter]` element.

**Story bar (replace the layout of `BeatTicks`, keep its `#beat-N` links working without scripts).**
- One row at every width: previous, the ticks with the current section's label ("04 Basis"), next. The active tick carries `aria-current="step"` and is visibly distinct by shape as well as tone. Previous and next read as unavailable at the ends (`aria-disabled`), and still do nothing harmful.
- A thin progress line along the bar's top edge shows progress through the chapter (transform only; it tracks scroll directly in both modes, since it is feedback, not decoration).
- On phones it must be one row no taller than 3.5rem with 44px targets (for example: previous and next as icon buttons with accessible names, ticks compact, the label in the middle). Update the bottom padding and `scroll-padding-bottom` rules that currently allow for 8.75rem, and the comments.
- Section labels come from one list shared with the headings (do not duplicate the strings).

**Header and menu.** The menu lists the opening, the four chapters with their place and year, and the ending; the current page is marked (`aria-current="page"` exists). Show "Chapter N of 4" beside the place-and-date tag on chapter pages.

**Person card (`PersonCardView`, `Backdrop`).**
- Each fact shows, for this chapter, whether each era's rule uses it: two small labelled marks, for example "1930: used" and "2020: not asked", derived from `cardFactsUsed`. Text, not colour alone.
- While beat 4 or 5 is active the facts the historical rule uses are emphasised; while beat 7 is active, the 2020 ones; elsewhere both are shown quietly. In `full` mode the emphasis moves with a short GSAP tween; in `still` mode it switches.
- A footer on the card, "In this chapter", gives each era's outcome confidence as a word and a four-step meter (high, moderate, low, cannot be determined), each linking to its beat. The meter is shape plus text.
- Each used fact links to the beat where the rule is quoted ("See the rule").
- Below 1024px the card opens from its button as now; make the open card a comfortable bottom sheet with a clear close control, and show on the button how many facts the current section uses.
- The opening page's card shows the facts only (no chapter marks).

## Task 2: The time machine (beat 6)

Replace the cross-fade with the site's signature comparison. Files: `src/components/beats/ChangeOfDate.tsx`, `src/motion/ChangeOfDateMotion.tsx`, `src/components/EraSwitch.tsx`, `src/motion/era.ts`, their tests, CSS.

- **Still version and no scripts:** both eras, one after the other, each a complete panel: the year, the document (image or its empty frame with the gap note), the instrument's title, "Who decides" and "On what evidence" (from `chapter.summary`), the rule as quoted (`basis.quote`, with its citation behind a disclosure), and, where the chapter has outcomes, the outcome's confidence word with a link to the full outcome. Nothing depends on a script.
- **Enhanced (script running, any width):** one stage and one control.
  - A native `<input type="range">` from the historical year to 2020, labelled, with `aria-valuetext` giving the year in view; plus the two years as buttons at its ends. This is the before-and-after slider: dragging it wipes from the historical document to the 2020 one with a visible divider (`clip-path`), and it works by keyboard for free.
  - A large date indicator counts between the two years as the value moves (decoration, `aria-hidden`; tabular figures so it does not jitter).
  - The information panel changes with the era in view (switching at the midpoint): instrument title, who decides, on what evidence, the quoted rule. Announce the era change in a polite live region. Both panels stay in the DOM; the one not in view is hidden from sight and from assistive technology only while enhanced.
  - The person card already reacts to the active beat (Task 1); additionally expose the era in view (`data-era-in-view` on the chapter element) so the card emphasises that era's facts while beat 6 is active.
- **Scroll control:** at 1024px and wider in `full` mode the section pins and scroll drives the same value (scrubbed), exactly as reversible as now; the range reflects it, and moving the range scrolls the page to the matching position. Below 1024px or in `still` mode nothing pins; the range and buttons set the value directly (tweened in `full`, instant in `still`).
- The pinned stage must fit between the header and the story bar at 1280 by 800 with the control, the date and the panel in view. Re-measure.
- Works for Tobique (no outcomes, no images: empty frames with their notes) and for an era whose item has no image.
- Keep `eraFromProgress` and extend `era.ts` with the pure functions you need (value to year, value to scroll position and back), tested first.

## Task 3: Documents you can inspect

Files: `src/components/CloseView.tsx`, `ItemView.tsx`, `Mount.tsx`, new viewer files, tests, CSS. Reads `highlights` from `src/content/regions.ts`, which may still be empty: everything must work with no highlights.

- **Viewer (a native `dialog`, opened by "Open close view" as now):** full-screen on phones, a large sheet on wider screens. Image area with zoom in, zoom out, reset and fit controls (buttons with names), wheel or trackpad zoom, pinch on touch, drag to pan, and arrow keys to pan and plus or minus to zoom when the image area itself has focus (with a short written instruction). Zoom is clamped so the page cannot be lost; reset always returns to the whole page. Put the transform arithmetic (clamp, zoom about a point, fit a region) in pure tested functions.
- **Highlights:** each highlight is a numbered outline over the page at its region, a real button with its label as its name. Choosing one centres and zooms to it, marks it selected, and scrolls the linked annotation into view in the side panel and marks it; choosing an annotation or a highlight's name in the panel does the same in reverse. A "show highlights" toggle hides the outlines for an unobstructed page.
- **Side panel:** transcription, annotations, source information (the provenance fields, expandable), in that order. Where an item has a `translation`, show original and translation side by side (stacked on phones), each labelled, the original in the source voice.
- **Translations:** for the three São Paulo items and the two São Paulo basis quotations, move the English that follows "English translation:" into the new `translation` / `quoteTranslation` fields, without changing a word, and render the pair in `ItemView`, `BasisBeat` and `PresentDay` as labelled original and translation.
- **In the page:** under each document image list its highlights as small buttons ("Paragraph 151") that open the viewer at that region. Images load at a size that stays sharp when zoomed (check what `next/image` serves; use the full file in the viewer).
- Without scripts the page already shows the image, transcription and annotations inline; keep that.

## Task 4: Cinematic storytelling

Files: `src/app/page.tsx`, `src/motion/*`, `src/components/beats/ChapterCard.tsx`, `PlacePhotograph.tsx`, cover components, CSS.

- **Opening:** a composed sequence in `full` mode, once per session, skippable (the Skip control exists): the light comes up, the title reveals by line, the framing follows, the card is set down with its border drawing, then "Begin" arrives. A quiet scroll cue is fine. The still page is the finished composition.
- **Chapter entrance:** the chapter card as a title page with presence: the chapter number, the place, the year as very large figures behind or beside the title, entering in sequence; the content note readable from the first frame.
- **Section reveals:** as a section enters, its number, heading and rule arrive, then its content rises a little and fades in, once. Never hide content that is already in view when the page loads, and never leave anything hidden if a trigger does not fire (set states from JS only, with `immediateRender` used carefully; prefer `gsap.from` created when the trigger is set up).
- **Parallax:** replace beat 2's grey placeholder blocks. Depth comes from typography and the backdrop (for example the year and place set large in the side column, moving at a different rate from the photograph's sheet, and the backdrop light drifting), never from moving or cropping the sourced photograph. Only at 1024px and wider.
- **Between chapters:** while the cover is closed, show the destination as a title card (chapter number, place, year), then open on it. Between the last chapter and the ending, and from the opening to chapter 1, likewise.
- **Detail:** refined hover and focus feedback on controls and document sheets (gated by `data-motion="full"`), consistent easing and durations defined once in `src/motion/gsap.ts`.
- Everything above is absent in `still` mode.

## Task 5: The ending

Files: `src/app/ending/page.tsx`, new components, tests, CSS.

- **Comparison matrix:** four places down, two dates across. A view control (a labelled group of radio-style buttons) switches what the cells show: who decides, on what evidence, outcome and confidence. Cells come from `chapter.summary` and `outcome.level`; each links to the chapter section it summarises. Tobique's outcome cells say that no person is placed in that chapter. Confidence uses the same word-plus-meter as the person card, with a legend. Below 768px the matrix becomes one card per place with the same control.
- Without scripts, all three views are shown as plain tables one after another.
- **Then and now:** the two columns are the historical and 2020 perspectives; a control can emphasise one column. Keep the existing "Comparing the four cases" text above the matrix; it carries the cautions about comparing different systems.
- **References:** the bibliography and image credits become expandable lists, one group per place, one entry per line with a hanging indent, links clickable. This changes how those two fields are rendered (the strings stay as they are): update the test that pins the bibliography as a single paragraph to assert the new behaviour instead.
- **Closing:** a final panel with what is fictional, the AI-use disclosure, and two controls: return to the opening, and start again (the existing Restart behaviour). In `full` mode the matrix rows arrive in sequence once.

## Side task R: highlight regions (data only)

Fill `src/content/regions.ts` for the eight document images in `public/images/`. For each item, one highlight per passage its transcription quotes (a paragraph, a section, a definition, a question), labelled with the document's own marker ("Paragraph 151", "Section 2(1)", "Question 9", "Quesito 8"), linked to the annotations that discuss it. Measure each rectangle on the actual image, then verify it: crop that rectangle from the file and look at the crop; it must contain the passage whole and little else. Record the pixel rectangle and the fractions. Report any passage that is not on the page shown (for example text transcribed from a different page): give it no highlight.

## Side task S: the stated gaps (research only, no edits)

The site states several limits honestly. Try to resolve them from primary sources and report what you find, with URLs and exact wording, as proposed replacement text for the controller to apply:
1. Whether section 2 of the Group Areas Act, No. 41 of 1950, was amended before the end of 1955.
2. Which edition of IBGE's PNAD Contínua interview manual governed interviews in 2020, and whether colour or race was asked in the 2020 telephone collection.
3. An official United Nations copy of Lovelace v. Canada (Communication No. 24/1977).
4. Whether the Employment Equity Act definition of "black people" was unchanged in 2020.
5. The date and photographer of the Arquivo Nacional cathedral photograph from the archive's own catalogue.
Report "not found" plainly where that is the result.

## Review

Each task's commit is reviewed by a separate agent for the rules above; findings are fixed in one wave before the final whole-branch review, which also renders the site in both modes at three sizes.
