# One Person, Many Boxes

The site is a Next.js app in `site/`. The research text is an AI-written draft from cited sources, for you to check and revise. Eleven images were added on 26 November 2026: eight pages of the quoted documents and three credited historical photographs. The Tobique chapter has no images, and its image fields are still placeholders. This file explains how to run the site, change its content, and what was left out on purpose.

## Run, test and build

You need Node.js. All commands run inside `site/`.

```
cd site
npm install
npm run dev      # the site at http://localhost:3000, reloads as you edit
npm test         # the tests
npm run lint     # code checks
npm run build    # the production build; all six pages are prerendered
npm start        # serves the production build, after npm run build
```

## Where the content lives

All text and images are set in `site/src/content/`:

- `chapters/louisiana.ts`, `chapters/sao-paulo.ts`, `chapters/johannesburg.ts`, `chapters/tobique.ts`: one file per chapter.
- `person.ts`: the person card.
- `pages.ts`: the opening and ending pages.
- `types.ts`: the shape every chapter must have. TypeScript reports an error if a file does not match it.

The order of the chapters is set in `site/src/content/index.ts`.

## Fill a slot

A slot is a placeholder, written `slot("…")`. The note inside the quotes says what belongs there. On the page a slot shows as the note in square brackets with a dashed outline, so you can see what is still missing.

To fill a slot, replace `slot("…")` with a string:

```ts
// before
explanation: slot("your explanation"),
// after: your own words between the quotes
explanation: "…",
```

Only one test file reads your content files: `site/src/content/content.test.ts`. Every other test runs against a made-up set of placeholder chapters in `site/src/test/fixtures.ts`, so filling slots, adding images or removing a beat from a chapter does not change them. The tests in `content.test.ts` that change as you work:

- "leaves a placeholder only where the text depends on an image not yet added": fails if a slot remains anywhere except the image-dependent fields (the place photograph and its context, each item's `alt`, `longDescription` and `alterations`, and `imageCredits`). Fill those as you add images; the test keeps passing.
- "validates every chapter": fails if a chapter refers to something that is not there, or breaks a rule below (a document image without a transcription, person-card facts listed on a page without the card). Fix the content, not the test.
- "has the four chapters in order", "has the fixed places, countries and dates" and "gives Tobique no outcome": change them only if you change those decisions.
- "shows the person card in every chapter but Tobique": change it if you change `showPersonCard` in a chapter file.

## Add an image

1. Put the file in `site/public/` (create the folder if it is not there), for example in a folder `site/public/images/`.
2. In the item, replace `image: null` with the file's path from `public`, and its width and height in pixels:

   ```ts
   image: { src: "/images/your-file.jpg", width: 1200, height: 1600 },
   ```

3. The close view loads the file at `src` as it is (not resized), so zooming in stays sharp up to that file's own size: use the largest file you have.
4. Fill the item's `alt` (short alternative text) and `longDescription`. A document with an image must also have a `transcription`. The tests report a document image without one.
5. Add the image's row to your credits ledger (see below), and fill the item's `provenance` fields.

Leave `image: null` until you have the file. The page then shows an empty frame with the item's `gapNote` if it has one, or "No image".

## The person card

Each chapter file has a `showPersonCard` line. When it is `true`, the chapter page shows the person card: in its own column on wide screens, and behind a "Person card" button on narrow ones. On a chapter page each fact's reason is folded behind a small "Reason" toggle and the chapter's outcome confidence sits right under the fiction statement, so at 1280 by 800 the whole card fits its column; the opening page shows every reason. When it is `false`, the page shows no person card at any width, and beat 4 lists no person-card facts. A chapter with `showPersonCard: false` must keep `cardFactsUsed: []` in both of its bases; the tests report it otherwise.

By default the Louisiana, São Paulo and Johannesburg pages show the card, and the Tobique page does not. The design plan ("The Tobique chapter") makes placing a fictional person in relation to that community a decision for you and your instructor, so the default is the fallback that places no one there. The opening page always shows the card. To show it on the Tobique page once that is decided, change this one line in `site/src/content/chapters/tobique.ts`:

```ts
showPersonCard: true,
```

## Mark an item as sensitive

Every item has `contentNote: null`, so it is shown open. To mark one item as sensitive, replace its `null` with your content note:

```ts
contentNote: "…", // your content note between the quotes
```

The item is then shown closed, as a disclosure labelled "Content note:" followed by your note, and opens only when the visitor chooses to. Each chapter also has its own chapter-level `contentNote`, shown under the chapter heading.

## The close view

"Open close view" under each item opens a dialog that fills a phone's screen and is a large sheet on wider ones. On the left (on top, on narrower screens) is the page itself; beside it, the transcription, the annotations and the source information (the provenance fields, folded). Focus moves into the dialog when it opens and back to the control that opened it when it closes; Escape closes it, and nothing behind it can be reached while it is open.

- **Zoom and move.** Zoom in, Zoom out, Fit width (the page's width across the view) and Reset (back to the whole page) are buttons. The mouse wheel or a trackpad zooms about the pointer, two fingers pinch on a touch screen, and dragging moves the page. When the image area itself has keyboard focus, the arrow keys move the page and plus and minus zoom; a line under the image says so. The page can be zoomed up to eight times its whole-page size and can never be moved out of view. With motion on, Reset, Fit width and choosing a highlight glide to their view; with motion off every change is instant. The arithmetic is in `site/src/components/viewer/transform.ts`, with its tests beside it.
- **Highlights.** `site/src/content/regions.ts` lists, for each document image, the passages its transcription quotes, as rectangles in fractions of the image, each with a label ("Paragraph 151") and the annotations that discuss it. In the close view each one is a numbered outline over the page, a button named by its label; choosing it zooms to it and marks its annotations (a bar and "About the chosen highlight"), scrolling them into view when the panel scrolls on its own. An annotation with a highlight has a "Show on page" button that does the same from the other side, and the highlights are also listed by name under the image. "Show highlights" hides the outlines for an unobstructed page. In the chapter page, the highlights are listed under each document image ("Highlights on this page"); each opens the close view at that passage. An item with no image, or no entry in `regions.ts`, simply has no highlights. To add or move one, measure the rectangle on the image file and give it as `x`, `y`, `w`, `h` between 0 and 1; the tests report a region outside the image or an annotation id that is not on the item.
- **Translations.** An item's `translation` and a basis's `quoteTranslation` hold an English translation of a source that is not in English (`null` otherwise). Where one is set, the original and the translation are shown side by side, each labelled ("Original", "English translation"), wherever there is room, and one above the other in narrow spaces: in the item, the close view, beat 4, beat 6 and beat 7. In the close view the side panel is made wider for a translated item, so at 1280 pixels the two sit side by side there too; on phones they stack. The original keeps the source's typeface; the translation is in the site's own.

## Interface labels

The site's own words (beat headings, button and link labels, and labels such as "Content note:", "Confidence:", "Citation:", "Person-card facts used:", "No image", "Reason:" and the ending page's headings) are working labels, not research text. They were written by AI, like the code. Review them and reword any you like. They are set in:

- `site/src/components/story.ts`: the section labels ("Title", "Place", "Items", "Basis", "Outcome", "Change of date", "Present day", "Next"), used both for the section headings and in the story bar ("04 Basis"), and the confidence words ("High", "Moderate", "Low", "Cannot be determined") and the person card's marks ("1930: used", "2020: not used");
- `site/src/components/BeatHeading.tsx`: the small section numbers ("02", "03" and so on) shown above each chapter section heading. They are decoration, hidden from screen readers, and show the beat number;
- `site/src/components/beats/`: "Content note:", "Person-card facts used:", "Confidence:", "Citation", "Instrument", "Reflection", "No items.", and in beat 6 (`ChangeOfDate.tsx`) "Who decides", "On what evidence", "The rule, as quoted", "Outcome confidence", "See the outcome" and, while the stage is pinned, "Read the full rule:". "No person is placed in this chapter, so no outcome is given." is in `story.ts` (`NO_PERSON_PLACED`), shared by beat 6 and the ending's matrix;
- `site/src/components/ItemView.tsx`: "Alternative text", "Description", "Transcription", "Annotations", "Provenance", "Content note:";
- `site/src/components/CloseView.tsx`: "Open close view", "Highlights on this page";
- `site/src/components/viewer/DocumentViewer.tsx`: "Close view:", "Close", "Highlights", "Show highlights", "Transcription", "Annotations", "About the chosen highlight", "Show on page:", "Source information", and what screen readers hear when a highlight is chosen ("Showing Paragraph 151. Annotations 1 and 2 marked.");
- `site/src/components/viewer/ViewerStage.tsx`: "Zoom in", "Zoom out", "Fit width", "Reset" (read as "Reset to the whole page"), the instruction under the image, the image area's name "Page image", and the spoken zoom level ("Zoom 125 percent");
- `site/src/components/Bilingual.tsx`: "Original" and "English translation";
- `site/src/components/ProvenanceList.tsx`: the provenance field names, shared by the item and the close view;
- `site/src/components/Mount.tsx`: "No image";
- `site/src/components/PersonCardView.tsx` and `PersonCardPanel.tsx`: "Person card", "Reason" (a toggle in a chapter), "Reason:" (on the opening page), "See the rule", "In this chapter", "Outcome confidence", "Close", and for screen readers "outcome, confidence:" and "facts used in this section";
- `site/src/components/PlaceDateTag.tsx`: "Chapter 1 of 4" and the others;
- `site/src/components/EraSwitch.tsx` (the two years as buttons, named "Show 1930" and "Show 2020" and so on for screen readers, and the range, named "Date, from 1930 to 2020"); `site/src/motion/era.ts` (the range's spoken value, such as "1962, 1930 in view"); `site/src/motion/ChangeOfDateMotion.tsx` (what screen readers hear when the era changes, "Now showing 2020."); `BeatTicks.tsx` ("Previous", "Next", "Sections", and for screen readers "Sections in this chapter", "Previous section", "Next section", "Sections, current:"), `NavMenu.tsx` ("Menu"), `navLinks.ts` ("Opening", "Ending", and the cover's "Chapter 1 of 4"), `beats/ChapterCard.tsx` ("Chapter 01" on the title page), `RestartButton.tsx` ("Restart"; the ending's closing panel names the same control "Start again"), `MotionSwitch.tsx` ("Motion"), `StatusLabel.tsx` (see below);
- `site/src/motion/OpeningMotion.tsx`: "Skip";
- `site/src/app/layout.tsx`: "Skip to content";
- `site/src/app/page.tsx`: "Introduction", "Note on language and content", "Begin:";
- `site/src/app/ending/page.tsx`: "Ending", "Comparing the four cases", "Then and now", "Reflection", "Method note", "Note on language", "References", "Bibliography", "Image credits", "Closing", "What is fictional or reconstructed", "AI-use disclosure", "Return to the opening" and "Start again";
- `site/src/components/ending/matrix.ts`: the matrix's three views ("Who decides", "On what evidence", "Outcome and confidence"); `ComparisonMatrix.tsx`: the column headings "Then" and "Now" (with the year in each card: "Then, 1930"), "Read the outcome", "Confidence" (the legend) and, for screen readers, "Place" and each table's caption ("Who decides, in each place: then and now"); `MatrixViews.tsx`: "Show", "Emphasise", "Both", "Then", "Now", and what screen readers hear when the view changes ("Showing: On what evidence.");
- `site/src/app/title.ts`: the working site title, used in every page's document title.

## Status labels

Each item shows one of three status words: sourced, reconstructed or fictional. They are plain interface labels, not research text, and you may reword them.

- The item's `status` in the chapter file must stay one of the three values `"sourced"`, `"reconstructed"` or `"fictional"`. The type in `site/src/content/types.ts` checks this.
- The word shown on the page is printed by `site/src/components/StatusLabel.tsx`, which currently prints the value as it is, in capitals. To reword the labels, change what that file prints for each value.

## Typefaces

The four type voices are loaded in `site/src/app/layout.tsx` through `next/font/google`. The source typeface, for words quoted from a source (currently IBM Plex Mono), is provisional. Choose it once you have seen your real sources, change it in `layout.tsx`, and record the choice in your visual-choice table.

## Motion

- Full motion runs only when the window is at least 1024 pixels wide. The same width is the layout breakpoint (Tailwind's `lg`). It is set in pixels in three places that must agree: `MOTION_QUERY` in `site/src/motion/gsap.ts`, `--breakpoint-lg` and the media queries in `site/src/app/globals.css`.
- At that width, only beats 2 and 6 pin. Beat 2 pins for about one screen of scrolling; meanwhile the place and the year, set large and upright in the column beside the photograph, drift upward at two different rates and the pool of light behind the page drifts a little. The photograph and its sheet stay still, whole and uncropped; the column is decoration, hidden from screen readers, and is the same whether or not the chapter has a photograph (Tobique shows its empty frame). Beat 6 pins for about one and a half screens; see "Beat 6, the change of date" below.
- Below 1024 pixels nothing pins.
- The Motion button in the header turns full motion on or off. When it is pressed, motion is on. It overrides the system's reduced-motion setting for the rest of the visit. With motion off, the site is the still version: nothing pins and nothing moves over time, but beat 6's controls still work, instantly. Switching it on a chapter page adds or removes the pins and their spacing, so the page keeps the reader at the same place in the same section (`MotionSwitch.tsx`; the arithmetic is `placeAt` and `scrollForPlace` in `site/src/components/story.ts`).
- By default the site follows the system setting: reduced motion means the still version.

### Beat 6, the change of date

Beat 6 compares the two dates. Without scripts, and before the page's script has run, it shows each era as a complete panel, one after the other: the year, the document (or its empty frame with the gap note), the instrument's title, who decides, on what evidence, the rule as quoted (with its citation behind "Citation") and, where the chapter has outcomes, the outcome's confidence with a link to the outcome. Tobique, which places no person, says so instead.

Once the script runs, at every width and in both motion modes, the two panels become one stage with one control:

- a range from the historical year to 2020, with the two years as buttons at its ends. Arrow keys, Home and End work on the range;
- the 2020 document wipes over the historical one from the left, with a brass divider, as the range moves; where either document has no image, the two swap at the midpoint instead, so an empty frame's note is never cut;
- a large date counts between the two years (decoration; screen readers hear the range's value instead);
- the information panel shows the era in view, switching at the midpoint, and screen readers hear "Now showing 2020." (or the historical year) when it switches (not while the range has focus: its own value says it). The panel not in view is hidden; if focus was inside it, focus moves to the range;
- the person card emphasises the facts used by the rule of the era in view.

In full motion at 1024 pixels and wider, the section pins and scrolling moves the same value: scrolling moves the range, dragging the range scrolls the page to the matching place, and the year buttons scroll there smoothly. Elsewhere nothing pins: the range moves the stage directly, and the year buttons carry it across in about a second and a half in full motion, or at once with motion off. Switching Motion, or crossing 1024 pixels, keeps the value unless the section was pinned; leaving the pin returns it to the historical year. Set in `site/src/components/beats/ChangeOfDate.tsx` (the panels), `site/src/motion/ChangeOfDateMotion.tsx` (the stage), `site/src/components/EraSwitch.tsx` (the control), `site/src/motion/era.ts` (the arithmetic) and the beat 6 rules in `site/src/app/globals.css`.

### Motion extras

These time-based extras run whenever motion is on, at any window width (only the pinning and beat 2's drift need 1024 pixels). With motion off, or with the system's reduced-motion setting and no override, none of them runs, nothing is ever hidden and no element carries a leftover style. Nothing in them loops, and each plays once.

- **Title reveals.** Each page's main heading (the opening title, the chapter heading with its place and date, the ending heading) rises into place line by line. Once the page has loaded, screen readers read the whole heading, during the reveal too. Once the lines are in place the heading is ordinary text again. Set in `site/src/motion/Reveal.tsx`.
- **Animated opening.** On the opening page, once per visit, the light comes up, the title rises line by line, the introduction follows, the person card is set down and a thin border draws around it, then the note and the Begin link arrive (about three seconds). A "Skip" button finishes it at once, and moving keyboard focus onto any part of the page finishes it too. Every part is readable by screen readers and reachable by keyboard throughout: only its opacity and position change. Restart clears the record, so the opening plays again. The still page is the finished composition. Set in `site/src/motion/OpeningMotion.tsx` and `useSequence.ts`; the parts are marked `data-opening-part` in `site/src/app/page.tsx`.
- **Chapter title page.** Each chapter opens on a title page: the chapter number ("Chapter 01") and the historical year in very large, faint figures behind the title. They come up first, then the title rises. Both are decoration, hidden from screen readers (the heading and the header's "Chapter 1 of 4" say the same). The content note is never animated and can be read from the first moment. Set in `site/src/components/beats/ChapterCard.tsx` and `site/src/motion/ChapterEntrance.tsx`.
- **Section reveals.** As each later section scrolls into view, its number, heading and rule arrive in turn, then each block of its content rises a little and fades in, once; scrolling back does not replay them. Whatever is already on screen when the page loads is left alone, keyboard focus moving into a block that has not arrived yet completes it at once, and reaching the end of the page completes anything left. Set in `site/src/motion/SectionReveals.tsx` (the chapter's `<main>`).
- **Cover between pages.** Choosing the menu links, the next-chapter link, the opening's Begin link or Restart fades a dark panel over the page showing where you are going: the chapter number, place and year, or "Ending" or "Opening". It holds for a moment, the page changes under it, and it fades away as the new page's title rises; the new page's heading receives keyboard focus as before. The panel is hidden from screen readers. Links within a page, a link to the page already shown, Back, Forward, reload and opening a link in a new tab are plain cuts. If the new page does not arrive within 4 seconds, the panel fades away anyway. Set in `site/src/motion/CoverProvider.tsx` and `CoverLink.tsx`; the title cards are built in `site/src/components/navLinks.ts`.
- **Hover and focus.** Links, buttons and document sheets change colour, border or shadow on hover and focus over 0.15 seconds with motion on, and at once with motion off.

The eases and durations are defined once, in `site/src/motion/gsap.ts` (`HOUSE_EASE`, `DURATION`, `STAGGER`, `RISE`); the hover transitions read the same ease and duration from `--ease-house` and `--duration-quick` in `site/src/app/globals.css`, and a test keeps the two equal.

One exception to "no hidden starting state in CSS": while the page loads, a short script in `site/src/app/layout.tsx` marks the page (`data-motion-pending`) when motion will be on, and `site/src/app/globals.css` hides the elements marked for a reveal (`data-reveal`: page titles and decorations) and makes the opening's parts see-through (never hidden from screen readers) while that mark is there, so nothing shows finished and then jumps. The mark is removed as soon as the reveals are set up, and after 2.5 seconds at the latest. Without scripts it is never set.

To turn one extra off for good, leaving the others:

- title reveals: in `site/src/motion/Reveal.tsx`, change `if (mode !== "full" || !el) return;` to `return;`;
- animated opening: in `site/src/app/page.tsx`, remove the `<OpeningMotion>` wrapper (keep what is inside it), and remove the light and border if you do not want them in the still page either;
- chapter title page: in `site/src/components/beats/ChapterCard.tsx`, replace `<ChapterEntrance>` with a fragment;
- section reveals: in `site/src/motion/SectionReveals.tsx`, change `if (mode !== "full" || !root) return;` to `return;`;
- cover: in `site/src/app/layout.tsx`, remove the `<CoverProvider>` wrapper (keep what is inside it). The links then work as plain links.

## Assets, credits and AI use

The site holds no generated images, sound or video. Its eleven images are in `site/public/images/`: whole pages of the cited documents, rendered from the holders' files, and one historical photograph each for Louisiana (U.S. National Archives), São Paulo (Arquivo Nacional, public domain) and Johannesburg (Touring Club Italiano, CC BY-SA 4.0, so it must keep its credit and licence line). They were chosen, downloaded and described by AI at your request, and resized only. Each item's `provenance` and the ending page's `imageCredits` record the holder, reference and rights as the holder states them; several holders state no rights, and the items say so. Confirm with your instructor that these are acceptable to use, and replace or remove any that are not. The Tobique chapter has no images on purpose (see `design-plan.md`, "The Tobique chapter"). Every frame without an image is an empty placeholder. Keep it that way.

The text is AI-generated. The code, this README, the interface labels (see "Interface labels" above) and, since 26 November 2026, the research content in `site/src/content/` were produced by AI at your request: the fictional person's four facts, the quotations and citations, the explanations, the outcomes, the reflections, the method note and the bibliography. Each quotation was copied from a source fetched that day and re-checked by a second pass, but you are responsible for it: open each cited source, confirm the wording and the reference details, and rewrite the reflections in your own words. The ending page's AI-use disclosure says the same thing to visitors; keep it accurate as you revise. Disclose all of this as your course requires; the "Read this first" section of `design-plan.md` gives the disclosure guidance.

Log every asset you make or alter in a credits ledger from the day you add it: creator, title, holder, reference number, rights statement or licence, where it is used, alterations permitted and alterations made. The ledger is your own record. The site shows what you write in each item's `provenance` and in the ending page's `imageCredits`.

## The ending page

The ending page runs in this order: "Comparing the four cases" (`comparability`, which explains why the four systems cannot be ranked on one scale), the comparison matrix, the reflection, method and language notes, the references, and a closing panel.

- **Comparison matrix ("Then and now").** Four places down, two dates across. It is built only from the content files: each chapter's `summary.historical` and `summary.present` (`decides`, `evidence`) and each outcome's `level`, with the outcome's full `text` behind "Read the outcome". It adds no text of its own beyond labels. Three views: who decides, on what evidence, outcome and confidence (the same word and four-step meter as the person card, with a legend). Every cell links to the chapter section it summarises (beat 4 or 7 for the rule, 5 or 7 for the outcome) through the cover between pages, and the chapter opens at that section with its heading focused. Tobique's outcome cells say that no person is placed in that chapter, with no meter, and link to its beat 6, which says the same. From 768 pixels wide each view is a table; below that, one card per place with the same headings and links. With scripts, a "Show" group of buttons picks one view (the chosen one is pressed, and screen readers hear the change once) and an "Emphasise" group can stress one date's column. Without scripts all three views are shown, one table after another. With motion on, the rows of the view shown rise in, in turn, once, the first time the matrix scrolls into view. Set in `site/src/components/ending/` (`matrix.ts` chooses what each cell shows) and the CSS at the end of `site/src/app/globals.css`.
- **References.** `bibliography` and `imageCredits` are read when the page is built: a blank line starts a new group, a short first line without a full stop ("Louisiana", "Place photographs") is the group's heading, and every other line is one entry. Each group with a heading opens and closes; a group without one is always shown. Every `https://` address becomes a link (up to the next space, leaving out a full stop or an unopened bracket at its end). Keep that layout when you edit them: write `\n` for a new line and `\n\n` between groups, or use a template string (between backticks) with real line breaks. Set in `site/src/components/ending/references.ts` and `ReferenceList.tsx`.
- **Closing.** What is fictional (`fictionStatement`), the AI-use disclosure (`aiUse`), "Return to the opening" and "Start again" (the same as Restart: it clears what this visit stored, so the opening plays again).
- The other notes (`reflection`, `methodNote`, `languageNote`) keep their line breaks, as in a transcription.

## Not built, on purpose

These items from the design plan were not built:

- the prediction (no question, guess or reveal anywhere on the site);
- snap;
- pointer drift;
- an outline of the earlier mount left visible after the change of date;
- a travelling close view (the close view opens in place);
- a drawn line (beat 6's rule under its heading is a plain hairline).

These gaps in the default design were not built either:

- The person card and the outcome sheet carry no status label (sourced, reconstructed or fictional). Only items do.
- Images have no `sizes` hint. The browser may fetch a larger file than it shows, and the first image on a page is not given priority. Beat 6's two documents are lazy in the page; once its comparison is set up, both are told to load when the stage comes within one and a half screens of the view, because a document clipped or hidden by the comparison is otherwise never fetched until it starts to show. After a jump straight into beat 6 they load as the section is reached, so on a slow connection the scans can still arrive a moment after the pin starts.

The Tobique chapter has no outcome and no reserved-colour mark. A test checks this.

## Known limitations

Small issues found in review and left for later:

- Content checks:
  - Each chapter file has its own copy of the `provenance()` placeholder helper.
  - The chapter check always uses the site's own person card, so a test cannot supply a different one.
  - Duplicate item ids or annotation ids are not reported. Keep every id unique.
- `site/README.md` is a leftover from the project template. `site/AGENTS.md` is not: `next dev` writes it (notes for AI coding tools about this Next.js version) and writes it again if it is deleted, so leave it.
- The tests for names only check that a name exists. Many disclosures share the plain labels "Citation" and "Provenance".
- Layout:
  - On large screens the person card sits on the left, but in reading order it comes after the main content.
  - While beat 6 shows 2020, the place-and-date tag still shows the historical year. The tag changes at beat 7.
  - Beats 2 and 6 pin their whole content. In beat 6 the document takes the wide column and is scaled down so the heading, the control, the date and the documents fit the window during the pin. At 1280 by 800 a portrait scan is drawn about 365 to 415 pixels wide (the Louisiana 1930 page, which is wider than tall, 438): the window's height is what limits it, so it stays below the 480 pixels aimed for, and the close view (section 3 or 7) is the place to read it; nothing scrolls inside the pin: while pinned, the information panel shows the quotation shortened to a few lines, with a link to the section that quotes it in full (4 or 7) in place of its citation. The full quotation is still in the page and is read in full. Beat 2 is not scaled: if your real content there is taller than the window, the bottom part is out of view until the pin ends.
  - Below 1024 pixels the place-and-date tag sits on its own row under the header and lets clicks through, so it covers no control, but it does cover a strip of the page beneath it.
  - A person-card panel opened on a narrow window stays open if the window is widened past 1024 pixels; it no longer dims the page there.
- Without scripts:
  - The "Open close view" button and the highlight names under a document image do nothing. The image, transcription and annotations are shown in the page itself.
  - The previous and next beat links go to beats 1 and 2.
- Behaviour:
  - The menu marks the current page by an exact path match. This would break if trailing slashes were turned on in the Next.js config.
  - Restart clears what the site has stored, but the Motion button keeps its setting until the page is reloaded.
  - While the cover between pages is up (about one and a half seconds), keyboard focus stays on the page beneath it.
  - Scroll positions are measured again whenever any disclosure or the person-card panel opens or closes.
  - Pins are placed under the header by finding it as `body > header`. Moving the header breaks this.
  - A link to a part of a chapter page (`#…`) that names nothing on the page starts at the top.
- Checked by hand in a browser but not by the automated tests: closing the close view with Escape, and the close view's drag and pinch and the alignment of its outlines (the arithmetic behind them is tested; its keys and wheel are tested).
- Untested: scrolling to a named part of a page, starting at the top, and scroll restoration.
