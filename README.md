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

Some tests check the placeholder content itself, and will fail once you start filling it in. That is expected. Change or delete them as you go:

- `site/src/content/content.test.ts`, "holds only slots in every research field": fails as soon as any slot holds a string.
- `site/src/components/ChapterPage.test.tsx`, "shows a sensitive item closed…": expects the first Louisiana item's transcription to still be its placeholder.
- `site/src/components/EraSwitch.test.tsx`: expects both of Louisiana's beat 6 items to have no image.

## Add an image

1. Put the file in `site/public/`, for example in a folder `site/public/images/`.
2. In the item, replace `image: null` with the file's path from `public`, and its width and height in pixels:

   ```ts
   image: { src: "/images/your-file.jpg", width: 1200, height: 1600 },
   ```

3. You can add a larger version for the close view with `largeSrc: "/images/your-file-large.jpg"`. It loads only when the close view opens, and a "Large image" link to it appears beside the item.
4. Fill the item's `alt` (short alternative text) and `longDescription`. A document with an image must also have a `transcription`. The tests report a document image without one.
5. Add the image's row to your credits ledger (see below), and fill the item's `provenance` fields.

Leave `image: null` until you have the file. The page then shows an empty frame with the item's `gapNote` if it has one, or "No image".

## Mark an item as sensitive

Every item has `contentNote: null`, so it is shown open. To mark one item as sensitive, replace its `null` with your content note:

```ts
contentNote: "…", // your content note between the quotes
```

The item is then shown closed, as a disclosure labelled "Content note:" followed by your note, and opens only when the visitor chooses to. Each chapter also has its own chapter-level `contentNote`, shown under the chapter heading.

## Status labels

Each item shows one of three status words: sourced, reconstructed or fictional. They are plain interface labels, not research text, and you may reword them.

- The item's `status` in the chapter file must stay one of the three values `"sourced"`, `"reconstructed"` or `"fictional"`. The type in `site/src/content/types.ts` checks this.
- The word shown on the page is printed by `site/src/components/StatusLabel.tsx`, which currently prints the value as it is, in capitals. To reword the labels, change what that file prints for each value.

## Typefaces

The four type voices are loaded in `site/src/app/layout.tsx` through `next/font/google`. The source typeface, for words quoted from a source (currently IBM Plex Mono), is provisional. Choose it once you have seen your real sources, change it in `layout.tsx`, and record the choice in your visual-choice table.

## Motion

- Full motion runs only when the window is at least 1024 pixels wide. The same width is the layout breakpoint (Tailwind's `lg`). It is set as `MOTION_QUERY` in `site/src/motion/gsap.ts`.
- At that width, only beats 2 and 6 pin, each for about one screen of scrolling. Beat 2 moves the decorative layers; beat 6 cross-fades the two images and grows the date line.
- Below 1024 pixels nothing pins. Beat 6's era switch cross-fades the images in place.
- The Motion button in the header turns full motion on or off. When it is pressed, motion is on. It overrides the system's reduced-motion setting for the rest of the visit. With motion off, the site is the still version: nothing pins and beat 6's era switch works as it does below 1024 pixels.
- By default the site follows the system setting: reduced motion means the still version.

## Assets and credits

The site uses no generative assets: no generated images, text, sound or video. Every frame without an image is an empty placeholder. Keep it that way.

Log every asset you make or alter in a credits ledger from the day you add it: creator, title, holder, reference number, rights statement or licence, where it is used, alterations permitted and alterations made. The ledger is your own record. The site shows what you write in each item's `provenance` and in the ending page's `imageCredits`.

## Not built, on purpose

These items from the design plan were not built:

- the prediction (no question, guess or reveal anywhere on the site);
- split-text reveals;
- snap;
- pointer drift;
- an animated opening (the opening and ending are still pages);
- an outline of the earlier mount left visible after the change of date;
- a hand-driven change of date (for example a slider);
- a travelling close view (the close view opens in place);
- a drawn line (beat 6's date line is a plain bar that grows; it is not drawn as a stroke);
- hotspots on images;
- a cover between routes.

The Tobique chapter has no outcome and no reserved-colour mark. A test checks this.

## Known limitations

Small issues found in review and left for later:

- Content checks:
  - Each chapter file has its own copy of the `provenance()` placeholder helper.
  - The chapter check always uses the site's own person card, so a test cannot supply a different one.
  - Duplicate item ids or annotation ids are not reported. Keep every id unique.
- `site/README.md` and `site/AGENTS.md` are leftovers from the project template.
- Tests that will need attention as you fill in content:
  - Listing person-card facts in a basis's `cardFactsUsed` shows those facts' labels again in beat 4 or 7. While those labels are still slots, the "one marked slot per slot" test in `ChapterPage.test.tsx` then fails.
  - The same happens if an item used in beat 6 has no image and its `gapNote` is a slot: the gap note shows in beat 6's caption as well as with the item.
  - The tests for names only check that a name exists. Many disclosures share the plain labels "Citation" and "Provenance".
- Layout:
  - On large screens the person card sits on the left, but in reading order it comes after the main content.
  - At 320 pixels wide the place-and-date tag overlaps the header.
  - At the end of beat 6 the place-and-date tag still shows the historical year, while beat 6 already shows the present day. The tag changes at beat 7.
  - Beats 2 and 6 pin their whole content. If your real content there is taller than the window, the bottom part is out of view until the pin ends.
  - A person-card panel opened on a narrow window stays open if the window is widened past 1024 pixels.
- Without scripts:
  - The "Open close view" button does nothing. The "Large image" link still works when the item has a `largeSrc`.
  - The previous and next beat links go to beats 1 and 2.
- Behaviour:
  - Annotations are shown as a numbered list, not as numbered buttons that move a highlight.
  - The menu marks the current page by an exact path match. This would break if trailing slashes were turned on in the Next.js config.
  - Restart clears what the site has stored, but the Motion button keeps its setting until the page is reloaded.
  - The place-and-date tag measures the page on every scroll.
  - Scroll positions are measured again whenever any disclosure or the person-card panel opens or closes.
  - Pins are placed under the header by finding it as `body > header`. Moving the header breaks this.
  - A link to a part of a chapter page (`#…`) that names nothing on the page starts at the top.
- Untested: closing the close view with Escape, the beat ticks, moving focus after a page change, scrolling to a named part of a page, starting at the top, and scroll restoration.
