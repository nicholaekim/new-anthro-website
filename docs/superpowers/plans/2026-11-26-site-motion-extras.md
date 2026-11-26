# Site Motion Extras Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add three motion extras to the finished site: split-text reveals on page titles, an animated opening, and a cover transition between pages.

**Architecture:** All three are time-based (not scroll-linked) and run only when motion mode is `full`, at any width. They share one pre-paint mechanism: an inline script marks the document as "motion pending" before first paint, CSS hides only elements marked for reveal while that mark is present, and the client removes the mark once the reveals are set up. Without scripts the mark is never set, so the page stays complete.

**Tech Stack:** As the first plan, plus GSAP SplitText.

**Spec:** `design-plan.md`, section 2 ("Text and typography", "Chapter transitions"), "Opening route", and "Reduced motion and the still version". First plan: `docs/superpowers/plans/2026-11-26-one-person-many-boxes-site.md`; its Global Constraints still bind, with the two amendments below.

All paths are relative to `site/`.

## Global Constraints

- Everything in the first plan's Global Constraints still applies, except:
  - **Amendment 1:** GSAP SplitText is now allowed. Still nothing else (no DrawSVG, Flip, ScrollTo, Draggable, ScrollSmoother).
  - **Amendment 2:** one hidden state is allowed in CSS: `html[data-motion-pending] [data-reveal] { visibility: hidden; }`. The attribute is set only by the inline pre-paint script, only when motion will be `full`, and the same script removes it after 2500 ms as a failsafe. No other hidden or offset state may live in CSS.
- These three extras run in `full` mode at any viewport width. Pinning stays at 1024 pixels and wider. In `still` mode none of them runs and no element is ever hidden.
- Animate `transform` and `opacity` only. SplitText masks (overflow clipping on line wrappers) are allowed.
- Text reveals apply to page `h1` elements only (opening title, chapter card, ending heading). Body text, captions, slots outside an `h1` and anything in the source voice are never split or animated.
- An `h1`'s accessible name must be the same before, during and after a reveal.
- The cover is a fixed, `aria-hidden` overlay that is a sibling of the page content in the layout, never an ancestor of it, and never carries a transform. When idle it is not rendered or has the `hidden` attribute, so it cannot intercept pointer events or focus.
- The cover intercepts in-app link clicks only. Browser Back, Forward, reload and modified clicks navigate as plain cuts.
- Every wait has a failsafe: the pending mark (2500 ms), a cover that never sees the route change (4000 ms, then it opens).
- No invented content. No new dependencies. TypeScript strict, no `any`, no `@ts-ignore`. No key handlers on arrow, space or page keys.

## Review Focus

1. Scripts disabled, or GSAP failing to load: every heading is visible and nothing stays hidden.
2. System reduced motion, or the Motion switch off: no reveal, no opening sequence, no cover, and no element with `visibility: hidden`.
3. A link to the page you are already on, a link with a hash on the same page, and a modified click (new tab): no cover, no stuck state.
4. Navigating twice quickly, or pressing Back while the cover is closing: the cover ends open and idle.
5. A title long enough to wrap, a resize while a reveal is mid-way, and late font loading: lines re-split without leaving stale wrappers or a hidden line.

---

### Task 1: Pending mark and title reveals

**Files:**
- Create: `src/motion/pending.ts`, `src/motion/Reveal.tsx`, `src/motion/MotionReady.tsx`
- Modify: `src/motion/gsap.ts`, `src/app/layout.tsx`, `src/app/globals.css`, `src/components/beats/ChapterCard.tsx`, `src/app/page.tsx`, `src/app/ending/page.tsx`
- Test: `src/motion/pending.test.ts`, `src/motion/Reveal.test.tsx`

**Interfaces:**
- Consumes: `resolveMotionMode`, `MotionMode`, `STORAGE_PREFIX`, the motion provider's mode.
- Produces:

```ts
// pending.ts
export const PENDING_ATTR = 'data-motion-pending';
export const PENDING_FAILSAFE_MS = 2500;
export function shouldMarkPending(systemReduced: boolean, override: MotionMode | null): boolean; // true exactly when resolveMotionMode(...) === 'full'
export function pendingScript(): string; // source of the inline script; it cannot import, so it restates the rule
// Reveal.tsx
export function Reveal(props: { children: React.ReactNode; className?: string }): JSX.Element; // renders an h1 with data-reveal
```

- [ ] **Step 1: Write the failing tests:**
  - `shouldMarkPending` agrees with `resolveMotionMode` for all six combinations of `systemReduced` (true, false) and `override` (null, 'full', 'still').
  - Evaluating `pendingScript()` in a stubbed environment (a fake `matchMedia`, `sessionStorage` and `document.documentElement`) sets `data-motion-pending` exactly in the combinations where `shouldMarkPending` is true, and schedules its removal with a 2500 ms timer.
  - If `sessionStorage` access throws inside the script, it does not throw and treats the override as null.
  - `Reveal` renders an `h1` with `data-reveal` whose accessible name equals its text content.
  - In `still` mode, mounting `Reveal` under the motion provider calls no SplitText constructor (mock `gsap/SplitText`) and leaves no inline style on the `h1`.
  - `MotionReady` removes `data-motion-pending` from `document.documentElement` on mount.
- [ ] **Step 2: Run** the tests. Expected: fail.
- [ ] **Step 3: Implement.** The layout renders the inline script in `head` and `MotionReady` once inside the motion provider, placed so its effect runs after the reveals' set-up. `Reveal` in `full` mode splits by lines with `mask: 'lines'`, `autoSplit: true`, and builds its tween inside `onSplit` and returns it (lines rise from `yPercent: 100` with a small stagger, a CustomEase named `house`). SplitText's default `aria` handling stays on. Replace the three page `h1` elements with `Reveal`, keeping their existing content and classes.
- [ ] **Step 4: Run** `npm test`, `npm run lint`, `npm run build`. Expected: all pass, six pages prerendered.
- [ ] **Step 5: Commit** `feat: split-text reveals on page titles`.

### Task 2: Animated opening

**Files:**
- Create: `src/motion/opening.ts`, `src/motion/OpeningMotion.tsx`
- Modify: `src/app/page.tsx`, `src/app/globals.css`
- Test: `src/motion/opening.test.ts`, `src/app/pages.test.tsx`

**Interfaces:**
- Consumes: Task 1's `Reveal` and pending mark, `STORAGE_PREFIX`, `clearStored`.
- Produces: `export const OPENING_SEEN_KEY = 'opmb:opening-seen'`; `export function shouldPlayOpening(mode: MotionMode, seen: boolean): boolean` (true only for `full` and not seen).

- [ ] **Step 1: Write the failing tests:**
  - `shouldPlayOpening('full', false)` is true; `('full', true)`, `('still', false)` and `('still', true)` are false.
  - The opening page renders two decorative elements, a light and a border around the person card, each `aria-hidden="true"` and containing no text.
  - In `still` mode there is no Skip button and no inline style on the decorative elements.
  - In `full` mode with nothing stored there is a button named Skip; pressing it stores `opmb:opening-seen`, removes the button, and leaves the person card and the heading in the document.
  - `clearStored()` removes `opmb:opening-seen`, so Restart replays the opening.
- [ ] **Step 2: Run** the tests. Expected: fail.
- [ ] **Step 3: Implement.** The decorative light and the four border bars are ordinary visible elements in the still page, marked `data-reveal` so they are covered by the pending mark. In `full` mode and not yet seen, one time-based timeline brings the light up (`opacity`), grows the four bars (`scaleX` or `scaleY`), then lets the title reveal play; Skip jumps the timeline to its end. On completion or Skip, store the seen key. The person card and all text stay visible throughout.
- [ ] **Step 4: Run** `npm test`, `npm run lint`, `npm run build`. Expected: all pass.
- [ ] **Step 5: Commit** `feat: animated opening sequence`.

### Task 3: Cover transition between pages

**Files:**
- Create: `src/motion/cover.ts`, `src/motion/CoverProvider.tsx`, `src/motion/CoverLink.tsx`
- Modify: `src/app/layout.tsx`, `src/components/NavMenu.tsx`, `src/components/beats/CloseBeat.tsx`, `src/app/page.tsx`, `src/components/RestartButton.tsx`, `src/motion/Reveal.tsx`
- Test: `src/motion/cover.test.ts`, `src/motion/CoverLink.test.tsx`

**Interfaces:**
- Consumes: the motion provider's mode, Task 1's `Reveal`.
- Produces:

```ts
// cover.ts
export type CoverState = 'idle' | 'closing' | 'covered' | 'opening';
export type CoverEvent = 'navigate' | 'closed' | 'arrived' | 'opened' | 'failsafe';
export const COVER_FAILSAFE_MS = 4000;
export function coverReducer(state: CoverState, event: CoverEvent): CoverState;
export function shouldCover(mode: MotionMode, currentPath: string, href: string): boolean; // false in still mode, for the same pathname, and for hash-only links
// CoverLink.tsx
export function CoverLink(props: React.ComponentProps<typeof Link>): JSX.Element;
```

- [ ] **Step 1: Write the failing tests:**
  - `coverReducer` follows idle → closing (navigate) → covered (closed) → opening (arrived) → idle (opened); `failsafe` from `closing` or `covered` goes to `opening`; `navigate` while not idle leaves the state unchanged; events that do not apply leave the state unchanged.
  - `shouldCover('still', '/', '/ending')` is false; `('full', '/ending', '/ending')` is false; `('full', '/chapters/louisiana', '/chapters/louisiana#beat-6')` is false; `('full', '/', '/chapters/louisiana')` is true.
  - In `still` mode, clicking a `CoverLink` does not prevent the default navigation and renders no cover element.
  - In `full` mode, clicking a `CoverLink` to another page prevents the default, renders the cover with `aria-hidden="true"`, and calls the router's `push` with the href only after the close animation completes (mock the router and resolve the animation).
  - With no route change after `COVER_FAILSAFE_MS` (fake timers), the cover returns to idle and is no longer rendered or is `hidden`.
- [ ] **Step 2: Run** the tests. Expected: fail.
- [ ] **Step 3: Implement.** `CoverLink` uses the Link component's `onNavigate` handler (check the installed Next docs for its exact shape). The provider plays the close (`opacity` 0 to 1), pushes the route, and when the pathname changes waits a frame, refreshes ScrollTrigger, then plays the open. While the cover is `closing` or `covered`, `Reveal` holds its tween paused and plays it when the cover starts opening. Replace `Link` with `CoverLink` for the menu links, the next-chapter link, the opening page's link to chapter 1, and Restart. In-page hash links stay as they are.
- [ ] **Step 4: Run** `npm test`, `npm run lint`, `npm run build`. Expected: all pass.
- [ ] **Step 5: Check in a browser** on the production build and record what you saw: a title reveal on each page type with no flash of the finished title first; the opening sequence playing once, Skip working, and not replaying on return until Restart; the cover closing and opening on a menu link, on the next-chapter link and on Restart; pins measuring correctly after a covered navigation at 1280 wide; Back and reload as plain cuts with nothing left hidden; the Motion switch off and a 375-wide viewport in still mode showing every heading with no reveal and no cover. With JavaScript disabled, every heading visible.
- [ ] **Step 6: Commit** `feat: cover transition between pages`. Update `/README.md`: move these three from "not built" to a short section saying what each does, the pending-mark exception, and how to turn each off.
