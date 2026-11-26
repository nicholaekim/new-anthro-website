"use client";

import { createContext, use, useEffect, useRef, type ReactNode } from "react";
import { gsap, HOUSE_EASE, SplitText, useGSAP } from "./gsap";
import { useMotionMode } from "./MotionProvider";

// What a sequence around a Reveal asks of it: hold its tween paused, let it play, or finish it at
// once. Without a provider the reveal plays as soon as it is set up.
export type RevealCue = "hold" | "play" | "finish";
export const RevealCueContext = createContext<RevealCue>("play");

function applyCue(tween: gsap.core.Tween, cue: RevealCue) {
  if (cue === "hold") tween.pause();
  else if (cue === "finish") tween.progress(1);
  else tween.play();
}

// A page's h1. In full motion its lines rise into place behind a mask. SplitText's default aria
// handling labels the h1 with its text and hides the line pieces, so the accessible name is the
// same before, during and after. While the reveal runs, autoSplit re-splits when fonts load or
// the width changes, and the tween is rebuilt in onSplit and returned, so SplitText carries its
// progress across.
// The set-up runs outside useGSAP's context (ignore), so the tween is reverted once, by the
// split's own revert, never a second time by the context (see ChangeOfDateMotion).
export function Reveal({ children, className, id }: { children: ReactNode; className?: string; id?: string }) {
  const { mode } = useMotionMode();
  const cue = use(RevealCueContext);
  const heading = useRef<HTMLHeadingElement>(null);
  const tween = useRef<gsap.core.Tween | null>(null);
  const cueNow = useRef(cue);

  useGSAP(
    (context) => {
      const el = heading.current;
      if (mode !== "full" || !el) return;
      let split: SplitText | null = null;
      context.ignore(() => {
        split = new SplitText(el, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) => {
            // paused still renders the start state at once (a from tween renders immediately).
            // Once the lines are in place the split is reverted: the h1 is its own markup again,
            // nothing is left clipped by the masks (a slot's outline, a descender), and nothing
            // re-splits later.
            const t = gsap.from(self.lines, {
              yPercent: 100,
              duration: 0.9,
              stagger: 0.08,
              ease: HOUSE_EASE,
              paused: true,
              onComplete: () => {
                tween.current = null;
                self.revert();
              },
            });
            applyCue(t, cueNow.current);
            tween.current = t;
            return t;
          },
        });
      });
      return () => {
        split?.revert();
        tween.current = null;
      };
    },
    { scope: heading, dependencies: [mode], revertOnUpdate: true },
  );

  useEffect(() => {
    cueNow.current = cue;
    if (tween.current) applyCue(tween.current, cue);
  }, [cue]);

  return (
    <h1 ref={heading} id={id} data-reveal className={className}>
      {children}
    </h1>
  );
}
