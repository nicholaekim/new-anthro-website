# One Person, Many Boxes

The site is a Next.js app in `site/`. Every piece of research text is still a placeholder. This file explains how to run the site, fill it in, and what was left out on purpose.

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

- "holds only slots in every research field": fails as soon as any slot holds a string. That is expected. Delete it once you start filling slots.
- "validates every chapter": fails if a chapter refers to something that is not there, or breaks a rule below (a document image without a transcription, person-card facts listed on a page without the card). Fix the content, not the test.
- "has the four chapters in order", "has the fixed places, countries and dates" and "gives Tobique no outcome": change them only if you change those decisions.
- "shows the person card in every chapter but Tobique": change it if you change `showPersonCard` in a chapter file.

## Add an image

1. Put the file in `site/public/` (create the folder if it is not there), for example in a folder `site/public/images/`.
2. In the item, replace `image: null` with the file's path from `public`, and its width and height in pixels:

   ```ts
   image: { src: "/images/your-file.jpg", width: 1200, height: 1600 },
   ```

3. You can add a larger version for the close view with `largeSrc: "/images/your-file-large.jpg"`. It loads only when the close view opens, and a "Large image" link to it appears beside the item.
4. Fill the item's `alt` (short alternative text) and `longDescription`. A document with an image must also have a `transcription`. The tests report a document image without one.
5. Add the image's row to your credits ledger (see below), and fill the item's `provenance` fields.

Leave `image: null` until you have the file. The page then shows an empty frame with the item's `gapNote` if it has one, or "No image".

## The person card

Each chapter file has a `showPersonCard` line. When it is `true`, the chapter page shows the person card: in its own column on wide screens, and behind a "Person card" button on narrow ones. When it is `false`, the page shows no person card at any width, and beat 4 lists no person-card facts. A chapter with `showPersonCard: false` must keep `cardFactsUsed: []` in both of its bases; the tests report it otherwise.

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

## Interface labels

The site's own words (beat headings, button and link labels, and labels such as "Content note:", "Confidence:", "Citation:", "Person-card facts used:", "No image", "Reason:" and the ending page's headings) are working labels, not research text. They were written by AI, like the code. Review them and reword any you like. They are set in:

- `site/src/components/beats/`: the beat headings ("Place", "Items", "Basis", "Change of date", "Present day", "Next" and the others), "Content note:", "Person-card facts used:", "Confidence:", "Citation", "Instrument", "Reflection", "No items.";
- `site/src/components/ItemView.tsx`: "Alternative text", "Description", "Transcription", "Annotations", "Provenance" and its field names, "Large image", "Content note:";
- `site/src/components/CloseView.tsx`: "Open close view", "Close view:", "Close";
- `site/src/components/Mount.tsx`: "No image";
- `site/src/components/PersonCardView.tsx` and `Backdrop.tsx`: "Person card", "Reason:", "Close";
- `site/src/components/EraSwitch.tsx` ("Show 2020"), `BeatTicks.tsx` ("Previous beat", "Next beat"), `NavMenu.tsx` ("Menu"), `navLinks.ts` ("Opening", "Ending"), `RestartButton.tsx` ("Restart"), `MotionSwitch.tsx` ("Motion"), `StatusLabel.tsx` (see below);
- `site/src/motion/OpeningMotion.tsx`: "Skip";
- `site/src/app/layout.tsx`: "Skip to content";
- `site/src/app/page.tsx`: "Introduction", "Note on language and content", "Begin:";
- `site/src/app/ending/page.tsx`: "Ending", "Comparing the four cases", "Records", "Outcome,", "Confidence:", "Citation:", "Reflection", "Method note", "Note on language", "Bibliography", "Image credits", "What is fictional or reconstructed", "AI-use disclosure";
- `site/src/app/title.ts`: the working site title, used in every page's document title.

## Status labels

Each item shows one of three status words: sourced, reconstructed or fictional. They are plain interface labels, not research text, and you may reword them.

- The item's `status` in the chapter file must stay one of the three values `"sourced"`, `"reconstructed"` or `"fictional"`. The type in `site/src/content/types.ts` checks this.
- The word shown on the page is printed by `site/src/components/StatusLabel.tsx`, which currently prints the value as it is, in capitals. To reword the labels, change what that file prints for each value.

## Typefaces

The four type voices are loaded in `site/src/app/layout.tsx` through `next/font/google`. The source typeface, for words quoted from a source (currently IBM Plex Mono), is provisional. Choose it once you have seen your real sources, change it in `layout.tsx`, and record the choice in your visual-choice table.

## Motion

- Full motion runs only when the window is at least 1024 pixels wide. The same width is the layout breakpoint (Tailwind's `lg`). It is set in pixels in three places that must agree: `MOTION_QUERY` in `site/src/motion/gsap.ts`, `--breakpoint-lg` and the media queries in `site/src/app/globals.css`.
- At that width, only beats 2 and 6 pin, each for about one screen of scrolling. Beat 2 moves the decorative layers; beat 6 cross-fades the two images and grows the date line.
- Below 1024 pixels nothing pins. Beat 6's era switch cross-fades the images in place.
- The Motion button in the header turns full motion on or off. When it is pressed, motion is on. It overrides the system's reduced-motion setting for the rest of the visit. With motion off, the site is the still version: nothing pins and beat 6's era switch works as it does below 1024 pixels.
- By default the site follows the system setting: reduced motion means the still version.

### Motion extras

Three time-based extras run whenever motion is on, at any window width (only the pinning needs 1024 pixels). With motion off, or with the system's reduced-motion setting and no override, none of them runs and nothing is ever hidden.

- **Title reveals.** Each page's main heading (the opening title, the chapter heading with its place and date, the ending heading) rises into place line by line. Once the page has loaded, screen readers read the whole heading, during the reveal too. Once the lines are in place the heading is ordinary text again. Set in `site/src/motion/Reveal.tsx`.
- **Animated opening.** On the opening page a light comes up behind the person card and a thin border grows around it, then the title rises. It plays once per visit; a "Skip" button jumps to the end. Restart clears the record, so the opening plays again. The light and border are also part of the still page. Set in `site/src/motion/OpeningMotion.tsx`; the light and border are in `site/src/app/page.tsx`.
- **Cover between pages.** Choosing the menu links, the next-chapter link, the opening's link to chapter 1 or Restart fades a plain dark panel over the page, changes page under it, and fades it away. Links within a page, a link to the page already shown, Back, Forward, reload and opening a link in a new tab are plain cuts. If the new page does not arrive within 4 seconds, the panel fades away anyway. Set in `site/src/motion/CoverProvider.tsx` and `CoverLink.tsx`.

One exception to "no hidden starting state in CSS": while the page loads, a short script in `site/src/app/layout.tsx` marks the page (`data-motion-pending`) when motion will be on, and `site/src/app/globals.css` hides the elements marked for a reveal (`data-reveal`) while that mark is there, so a heading never shows finished and then jumps. The mark is removed as soon as the reveals are set up, and after 2.5 seconds at the latest. Without scripts it is never set.

To turn one extra off for good, leaving the others:

- title reveals: in `site/src/motion/Reveal.tsx`, change `if (mode !== "full" || !el) return;` to `return;`;
- animated opening: in `site/src/app/page.tsx`, remove the `<OpeningMotion>` wrapper (keep what is inside it), and remove the light and border if you do not want them in the still page either;
- cover: in `site/src/app/layout.tsx`, remove the `<CoverProvider>` wrapper (keep what is inside it). The links then work as plain links.

## Assets, credits and AI use

The site holds no generated images, sound or video, and no generated research content: every research field is still a slot for your own work, and every frame without an image is an empty placeholder. Keep it that way.

It is not free of AI-generated text, though. The code, this README and the interface labels (see "Interface labels" above) were produced by AI at your request. The labels are working labels for you to review, and you may reword them. Disclose this as your course requires; the "Read this first" section of `design-plan.md` gives the disclosure guidance.

Log every asset you make or alter in a credits ledger from the day you add it: creator, title, holder, reference number, rights statement or licence, where it is used, alterations permitted and alterations made. The ledger is your own record. The site shows what you write in each item's `provenance` and in the ending page's `imageCredits`.

## Long notes on the ending page

Line breaks inside a filled ending note (`bibliography`, `imageCredits` and the others in `pages.ts`) are kept on the page, as they are in a transcription. Write `\n` inside the quotes for a new line, or use a template string (between backticks) with real line breaks.

## Not built, on purpose

These items from the design plan were not built:

- the prediction (no question, guess or reveal anywhere on the site);
- snap;
- pointer drift;
- an outline of the earlier mount left visible after the change of date;
- a hand-driven change of date (for example a slider);
- a travelling close view (the close view opens in place);
- a drawn line (beat 6's date line is a plain bar that grows; it is not drawn as a stroke);
- hotspots on images.

These gaps in the default design were not built either:

- There is no separate translation field. A source not in English has only its `transcription`; the design plan asks for your transcription and your translation as separate labelled text.
- The person card and the outcome sheet carry no status label (sourced, reconstructed or fictional). Only items do.
- Images have no `sizes` hint, and none is set to load eagerly. The browser may fetch a larger file than it shows, and the first image on a page is not given priority.

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
  - At the end of beat 6 the place-and-date tag still shows the historical year, while beat 6 already shows the present day. The tag changes at beat 7.
  - Beats 2 and 6 pin their whole content. In beat 6 the images are scaled down so the heading, era switch, images and both captions fit the window during the pin; very long gap notes in the captions could still push it past the window. Beat 2 is not scaled: if your real content there is taller than the window, the bottom part is out of view until the pin ends.
  - Below 1024 pixels the place-and-date tag sits on its own row under the header and lets clicks through, so it covers no control, but it does cover a strip of the page beneath it.
  - A person-card panel opened on a narrow window stays open if the window is widened past 1024 pixels.
- Without scripts:
  - The "Open close view" button does nothing. The "Large image" link still works when the item has a `largeSrc`.
  - The previous and next beat links go to beats 1 and 2.
- Behaviour:
  - Annotations are shown as a numbered list, not as numbered buttons that move a highlight.
  - The menu marks the current page by an exact path match. This would break if trailing slashes were turned on in the Next.js config.
  - Restart clears what the site has stored, but the Motion button keeps its setting until the page is reloaded.
  - While the cover between pages is up (about one second), keyboard focus stays on the page beneath it.
  - The place-and-date tag measures the page on every scroll.
  - Scroll positions are measured again whenever any disclosure or the person-card panel opens or closes.
  - Pins are placed under the header by finding it as `body > header`. Moving the header breaks this.
  - A link to a part of a chapter page (`#…`) that names nothing on the page starts at the top.
- Untested: closing the close view with Escape, the beat ticks, moving focus after a page change, scrolling to a named part of a page, starting at the top, and scroll restoration.
