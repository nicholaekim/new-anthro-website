# One Person, Many Boxes Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the default design in `design-plan.md` as a working Next.js site whose every research slot is a visible placeholder the student fills later.

**Architecture:** A still, server-rendered site comes first: six routes, each chapter page a sequence of eight sibling beat sections fed by one typed content file per chapter. A thin client-side motion layer is then added on desktop only, through `gsap.matchMedia()`, pinning and scrubbing two beats. Content is visible by default and animation only ever adds to it.

**Tech Stack:** Next.js (App Router, TypeScript strict), Tailwind CSS, GSAP with ScrollTrigger and CustomEase, `@gsap/react`, Vitest with React Testing Library and jsdom.

**Spec:** `design-plan.md` at the repository root. Read sections 1 (staging, chapter skeleton), 3 (items, Tobique), 4 (palette roles, type voices) and 5.

**Repository layout:** the repository root holds the spec, this plan and the gate files. The app lives in `site/`. All paths below are relative to `site/` unless they start with `/`.

## Global Constraints

- No invented content. Every research slot is a `Slot` value and renders as a visibly marked placeholder. Do not write historical facts, document contents, citations, narration or analysis. The only real strings are the places, countries and dates below, route slugs, and interface labels.
- Chapters, in this order: Louisiana, United States, 1930; São Paulo, Brazil, 1950; Johannesburg, South Africa, 1955; Tobique, New Brunswick, Canada, 1960. Present-day date for all four: 2020. Slugs: `louisiana`, `sao-paulo`, `johannesburg`, `tobique`.
- Routes: `/` (opening), `/chapters/[slug]`, `/ending`. All six pages are statically prerendered.
- Motion breakpoint: 1024 pixels wide. Full motion only when the viewport is at least that wide and motion mode is `full`. Below it, or in `still` mode, nothing pins.
- Only two beats pin: beat 2 and beat 6. Pins are siblings, never nested. Never animate the pinned element itself; pin a wrapper and animate children.
- Animate `transform` and `opacity` only.
- GSAP pieces allowed: core, ScrollTrigger, CustomEase, `gsap.matchMedia()`, `useGSAP` with a `scope`. Nothing else from GSAP.
- Hidden or offset starting states are applied inside the animation set-up, never in CSS, so the page is complete without scripts.
- No prediction feature. The Tobique chapter has no outcome and no reserved-colour mark.
- The reserved colour (`--color-reserved`) appears only on the outcome mark in beat 5.
- Four type voices as CSS variables: `--font-source` (IBM Plex Mono, provisional), `--font-yours` (Source Serif 4), `--font-title` (Fraunces), `--font-interface` (Inter), loaded with `next/font/google`.
- Interactive targets are at least 24 by 24 CSS pixels, and 44 by 44 under `pointer: coarse`.
- `html` keeps `scroll-behavior: auto`. No key handlers on arrow, space or page keys.
- TypeScript strict, no `any`, no `@ts-ignore`. No new dependencies beyond the tech stack above.
- Check current Next.js conventions against the installed version before using an API (for example whether route `params` is a promise).

## Review Focus

1. A chapter whose optional parts are missing (no basis, no items, no present-day instrument, an item with no image): the page still renders, with an empty mount or an omitted beat, and never throws.
2. Scripts disabled: every slot, both eras and every item are in the served HTML, in story order.
3. Keyboard only: every control is reachable, focus is visible, and closing the close view returns focus to the control that opened it.
4. Resizing across 1024 pixels, or flipping the motion switch: pins are removed cleanly and no inline styles are left behind.
5. Reload or Back into a chapter: the page starts at the top and no pin is mis-measured.

---

### Task 1: Scaffold and content model

**Files:**
- Create: the app in `site/` with `npx create-next-app@latest site --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --disable-git --yes`
- Create: `vitest.config.ts`, `vitest.setup.ts`, and a `"test": "vitest run"` script
- Create: `src/content/slot.ts`, `src/content/types.ts`, `src/content/person.ts`, `src/content/chapters/louisiana.ts`, `sao-paulo.ts`, `johannesburg.ts`, `tobique.ts`, `src/content/index.ts`, `src/content/validate.ts`
- Test: `src/content/content.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:

```ts
// slot.ts
export type Slot = { readonly slot: string };          // the note says what belongs here
export const slot: (note: string) => Slot;
export type Text = string | Slot;
export const isSlot: (t: Text) => t is Slot;

// types.ts
export type Era = 'historical' | 'present';
export type Status = 'sourced' | 'reconstructed' | 'fictional';
export interface ImageRef { src: string; width: number; height: number; largeSrc?: string }
export interface Provenance { creator: Text; title: Text; holder: Text; reference: Text; rights: Text; alterations: Text }
export interface Annotation { id: string; text: Text }
export interface Item {
  id: string; kind: 'document' | 'photograph'; status: Status;
  image: ImageRef | null; alt: Text; longDescription: Text;
  transcription: Text | null; provenance: Provenance;
  contentNote: Text | null; annotations: Annotation[]; gapNote: Text | null;
}
export interface Basis { quote: Text; citation: Text; explanation: Text; cardFactsUsed: string[] }
export interface Outcome { text: Text; confidence: Text; citation: Text }
export interface Chapter {
  slug: string; place: string; country: string; historicalYear: number; presentYear: 2020;
  contentNote: Text; photograph: Item; photographContext: Text;
  items: Item[]; basis: Basis | null; outcome: Outcome | null;
  changeOfDate: { historicalItemId: string; presentItemId: string } | null;
  present: { instrument: Item | null; basis: Basis | null; outcome: Outcome | null; reflection: Text };
}
export interface PersonFact { id: string; label: Text; value: Text; reason: Text }
export interface PersonCard { facts: PersonFact[]; fictionStatement: Text }

// index.ts
export const chapters: readonly Chapter[];
export const person: PersonCard;
export function getChapter(slug: string): Chapter | undefined;

// validate.ts
export function validateChapter(c: Chapter): string[];   // empty array means valid
```

- [ ] **Step 1: Scaffold.** Run the create-next-app command from the repository root. Install `gsap`, `@gsap/react`, and dev dependencies `vitest`, `@vitejs/plugin-react`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`. Configure Vitest for jsdom with the `@/` alias.
- [ ] **Step 2: Write the failing tests** in `src/content/content.test.ts`:
  - `chapters` has length 4 and its slugs are exactly `['louisiana', 'sao-paulo', 'johannesburg', 'tobique']`.
  - Places, countries and historical years equal the Global Constraints values, and every `presentYear` is 2020.
  - `validateChapter` returns `[]` for all four chapters.
  - The Tobique chapter has `outcome === null` and `present.outcome === null`.
  - Every `Text` field reachable from `chapters` and `person` satisfies `isSlot` (walk the objects recursively; ids, slugs, place, country and `cardFactsUsed` entries are exempt).
  - `validateChapter` reports a problem when a `document` item with an image has `transcription === null`, when `changeOfDate` names an id that is not in `items` or `present.instrument`, and when a `cardFactsUsed` id is not in `person.facts`.
  - `getChapter('nope')` is `undefined`.
- [ ] **Step 3: Run** `npm test`. Expected: fails, modules not found.
- [ ] **Step 4: Implement** the content files. Each chapter gets one photograph item, two historical items and one present-day instrument, all with `image: null` and slot text. `person` gets four facts. Slot notes describe what the student must supply, in the words of the spec's bracketed slots.
- [ ] **Step 5: Run** `npm test` and `npm run lint`. Expected: all pass.
- [ ] **Step 6: Commit** `feat: scaffold site and typed content model`.

### Task 2: Still version of a chapter

**Files:**
- Create: `src/app/chapters/[slug]/page.tsx`, `src/components/SlotText.tsx`, `StatusLabel.tsx`, `Mount.tsx`, `ItemView.tsx`, `Disclosure.tsx`, `PersonCardView.tsx`, and `src/components/beats/ChapterCard.tsx`, `PlacePhotograph.tsx`, `ItemsBeat.tsx`, `BasisBeat.tsx`, `OutcomeBeat.tsx`, `ChangeOfDate.tsx`, `PresentDay.tsx`, `CloseBeat.tsx`, `src/components/ChapterPage.tsx`
- Modify: `src/app/layout.tsx`, `src/app/globals.css`
- Test: `src/components/ChapterPage.test.tsx`

**Interfaces:**
- Consumes: Task 1's types, `chapters`, `person`, `getChapter`, `isSlot`.
- Produces: `ChapterPage({ chapter, person, next }: { chapter: Chapter; person: PersonCard; next: { href: string; label: string } })`. Each beat is a `<section>` with `data-beat="1"` to `"8"`, an `id` of `beat-1` to `beat-8`, and a heading. `SlotText({ value }: { value: Text })` renders a slot as text inside an element with `data-slot` and a dashed outline, and a string as plain text. `Disclosure` wraps the native `details` element.

- [ ] **Step 1: Write the failing tests:**
  - Rendering the Louisiana chapter gives eight `[data-beat]` sections in the order 1 to 8, and the first heading contains `Louisiana` and `1930`.
  - Rendering Tobique gives no `[data-beat="5"]` section and no element with `data-mark`.
  - A fixture chapter with `basis: null`, `items: []`, `changeOfDate: null` and `present.instrument: null` renders without throwing, omits beats 4 and 6, and shows one empty mount in beat 7.
  - An item with `image: null` renders an element with `data-empty-mount` containing its `gapNote`.
  - `renderToString` of the Louisiana chapter contains both `data-era="historical"` and `data-era="present"` regions, and one `data-slot` per slot in the chapter (count them from the content).
  - Every `details` summary in the page has an accessible name.
- [ ] **Step 2: Run** the tests. Expected: fail.
- [ ] **Step 3: Implement.** Server components only. Beat 6 in the still version shows the two mounts one after the other, each labelled by year. Beat 5 shows the outcome as text under a heading, with one small shape carrying `data-mark` in the reserved colour. Palette roles and the four font variables go in `globals.css` as CSS custom properties and Tailwind theme colours named by role. `generateStaticParams` returns the four slugs, and an unknown slug calls `notFound()`.
- [ ] **Step 4: Run** `npm test`, `npm run lint`, `npm run build`. Expected: all pass and the four chapter pages are prerendered.
- [ ] **Step 5: Commit** `feat: still version of chapter pages`.

### Task 3: Navigation, close view, opening and ending

**Files:**
- Create: `src/components/NavMenu.tsx`, `BeatTicks.tsx`, `PlaceDateTag.tsx`, `CloseView.tsx`, `RestartButton.tsx`, `FocusOnNavigate.tsx`, `src/app/ending/page.tsx`
- Modify: `src/app/page.tsx`, `src/app/layout.tsx`, `src/components/ItemView.tsx`
- Test: `src/components/NavMenu.test.tsx`, `CloseView.test.tsx`, `src/app/pages.test.tsx`

**Interfaces:**
- Consumes: Task 2's components and `data-beat` sections.
- Produces: `NavMenu` (one button that opens a list of six links), `CloseView({ item })` (a client component around the native `dialog` element, opened with `showModal`), `STORAGE_PREFIX = 'opmb:'` exported from `src/lib/storage.ts` with `clearStored(): void`.

- [ ] **Step 1: Write the failing tests:**
  - The menu lists exactly six links in order: opening, the four chapters, ending. Each chapter link's text contains its place and both years.
  - Opening the close view moves focus inside it, and closing it returns focus to the button that opened it. (jsdom lacks `showModal`; stub it in `vitest.setup.ts` to set the `open` attribute.)
  - The close view has a visible heading that names it, a close button, and a plain link to the large image when the item has one.
  - The opening page renders the person card, a title slot, a framing slot, a site-level note slot, and a link to `/chapters/louisiana`.
  - The ending page renders, in this order: the comparability slot, the records, the reflection slot, method note, note on language, bibliography, image credits, fiction statement, AI-use disclosure.
  - `clearStored` removes every sessionStorage key that starts with `opmb:` and leaves others.
- [ ] **Step 2: Run** the tests. Expected: fail.
- [ ] **Step 3: Implement.** `BeatTicks` reads the beats present on the page and provides previous and next links to `#beat-N`. `FocusOnNavigate` moves focus to the page's `h1` when the pathname changes. Add a skip link. The opening and ending are still pages.
- [ ] **Step 4: Run** `npm test`, `npm run lint`, `npm run build`. Expected: all pass, six pages prerendered.
- [ ] **Step 5: Commit** `feat: navigation, close view, opening and ending`.

### Task 4: Motion layer

**Files:**
- Create: `src/motion/gsap.ts`, `motionMode.ts`, `MotionProvider.tsx`, `era.ts`, `PlacePhotographMotion.tsx`, `ChangeOfDateMotion.tsx`, `src/components/MotionSwitch.tsx`, `EraSwitch.tsx`, `Backdrop.tsx`
- Modify: `src/components/ChapterPage.tsx`, `beats/PlacePhotograph.tsx`, `beats/ChangeOfDate.tsx`, `src/app/layout.tsx`, `src/app/globals.css`
- Test: `src/motion/motion.test.ts`, `src/components/EraSwitch.test.tsx`

**Interfaces:**
- Consumes: `data-beat="2"` and `data-beat="6"` sections, `STORAGE_PREFIX`.
- Produces:

```ts
// motionMode.ts
export type MotionMode = 'full' | 'still';
export function resolveMotionMode(systemReduced: boolean, override: MotionMode | null): MotionMode;
// era.ts
export function eraFromProgress(progress: number): Era;                 // progress >= 0.5 is 'present'
export function scrollTargetForEra(start: number, end: number, era: Era): number;
// gsap.ts
export const MOTION_QUERY = '(min-width: 1024px)';
```

- [ ] **Step 1: Write the failing tests:**
  - `resolveMotionMode(true, null)` is `'still'`; `(false, null)` is `'full'`; `(true, 'full')` is `'full'`; `(false, 'still')` is `'still'`.
  - `eraFromProgress(0)` and `(0.49)` are `'historical'`; `(0.5)` and `(1)` are `'present'`.
  - `scrollTargetForEra(100, 900, 'historical')` is `100` and `'present'` is `900`.
  - In still mode, pressing `EraSwitch` flips `aria-pressed` and the `data-era-shown` attribute on the beat 6 container, with no call to `window.scrollTo`.
  - `MotionSwitch` stores the override under `opmb:motion` and `MotionProvider` reads it back on mount.
- [ ] **Step 2: Run** the tests. Expected: fail.
- [ ] **Step 3: Implement.** `gsap.ts` registers ScrollTrigger, CustomEase and `useGSAP` once. All set-up runs inside `gsap.matchMedia()` under `MOTION_QUERY`, gated on mode `full`, in `useGSAP` with a `scope` and with the mode as a dependency and `revertOnUpdate`. Beat 2: pin a wrapper for one viewport height and scrub two or three foreground layers by different amounts. Beat 6: pin a wrapper for one viewport height and scrub one timeline that cross-fades the two mounts with opacity and scales the date line along its length. In full mode `EraSwitch` scrolls to `scrollTargetForEra` using the trigger's start and end. In still mode it runs a timed opacity cross-fade. `Backdrop` is a fixed layer (surface, light, person card) shown only at the motion breakpoint; below it the person card is a fixed button that opens the card. Set `history.scrollRestoration` to `'manual'` on chapter pages. Refresh ScrollTrigger after fonts are ready.
- [ ] **Step 4: Run** `npm test`, `npm run lint`, `npm run build`. Expected: all pass.
- [ ] **Step 5: Check in a browser** with `npm run dev` and record what you saw in the report: at 1280 pixels wide beats 2 and 6 pin and scrub; narrowing below 1024 removes both pins and leaves no inline styles on the mounts; the motion switch does the same; reload mid-chapter starts at the top.
- [ ] **Step 6: Commit** `feat: desktop motion layer for beats 2 and 6`.

### Task 5: Access pass and handover notes

**Files:**
- Modify: components as findings require
- Create: `/README.md` at the repository root
- Test: `src/app/access.test.tsx`

**Interfaces:**
- Consumes: everything above.
- Produces: nothing new.

- [ ] **Step 1: Write the failing tests:**
  - Every `button` and `a` on a chapter page has an accessible name.
  - Every `img` has an `alt` attribute, and decorative layers carry `aria-hidden="true"`.
  - Each page has exactly one `h1`, and headings do not skip a level.
  - The rendered page contains no `style` attribute in still mode.
- [ ] **Step 2: Run** the tests, fix what fails, and check focus visibility and target sizes in `globals.css` against the Global Constraints.
- [ ] **Step 3: Write `/README.md`:** how to run, test and build; how to fill a slot (replace `slot('…')` with a string); how to add an image; that the source typeface is provisional; and the list of spec items deliberately not built (every "extra" in the spec's cut list, and the prediction).
- [ ] **Step 4: Run** `npm test`, `npm run lint`, `npm run build`. Expected: all pass.
- [ ] **Step 5: Commit** `feat: access pass and handover notes`.
