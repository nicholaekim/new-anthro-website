"use client";

import type { ReactNode } from "react";
import { DURATION, RISE } from "./gsap";
import { useMotionMode } from "./MotionProvider";
import { RevealCueContext } from "./Reveal";
import { useSequence } from "./useSequence";

// When each part of the title page arrives, in seconds: the large year behind the title first,
// slowly, then the chapter number and its rule, then the title rises (its Reveal).
const AT = { number: 0.2, title: 0.35 } as const;

// Beat 1, the chapter's title page (see useSequence). In full motion, once per page: the large
// figures ([data-chapter-figures]) come up and settle, the chapter number ([data-chapter-number])
// and its rule ([data-chapter-rule]) arrive, then the h1 rises. All three are decoration, hidden
// from assistive technology; the content note is never touched, so it can be read from the first
// frame. Arriving under the cover, it waits for the cover to open. Its wrapper is display:
// contents, so the section's own layout is unchanged.
export function ChapterEntrance({ children }: { children: ReactNode }) {
  const { mode } = useMotionMode();
  const { scope, cue } = useSequence(mode === "full", (tl, playTitle) => {
    tl.fromTo("[data-chapter-figures]", { opacity: 0, y: RISE * 3 }, { opacity: 1, y: 0, duration: DURATION.light * 1.25 }, 0)
      .fromTo("[data-chapter-number]", { opacity: 0, y: RISE / 2 }, { opacity: 1, y: 0, duration: DURATION.part }, AT.number)
      .fromTo("[data-chapter-rule]", { scaleX: 0 }, { scaleX: 1, duration: DURATION.enter }, AT.number)
      .call(playTitle, [], AT.title);
  });
  return (
    <RevealCueContext value={cue}>
      <div ref={scope} className="contents">
        {children}
      </div>
    </RevealCueContext>
  );
}
