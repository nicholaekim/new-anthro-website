"use client";

import { createContext, use, useLayoutEffect, useRef, type ReactNode } from "react";
import { useCover } from "./CoverProvider";
import { DURATION, gsap, HOUSE_EASE, SplitText, STAGGER, useGSAP } from "./gsap";
import { useMotionMode } from "./MotionProvider";

// What a sequence around a Reveal asks of it: hold its tween paused, let it play, or finish it at
// once. Without a provider the reveal plays as soon as it is set up. While the cover between
// pages is closing or up, every reveal is held, and plays when the cover starts opening.
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
// React keeps its own nodes: SplitText splits deep clones of the h1's children, and when the
// reveal ends, on unmount, on a mode change, or if the set-up throws, the original nodes are put
// back (SplitText's own revert restores markup with innerHTML, which would leave React's nodes
// detached). Once back, nothing is clipped by the masks and nothing re-splits later.
// The set-up runs outside useGSAP's context (ignore), so the tween is reverted once, by the
// split's own revert, never a second time by the context (see ChangeOfDateMotion).
export function Reveal({ children, className, id }: { children: ReactNode; className?: string; id?: string }) {
  const { mode } = useMotionMode();
  const { state: coverState } = useCover();
  const sequenceCue = use(RevealCueContext);
  const cue: RevealCue = coverState === "closing" || coverState === "covered" ? "hold" : sequenceCue;
  const heading = useRef<HTMLHeadingElement>(null);
  const tween = useRef<gsap.core.Tween | null>(null);
  const cueNow = useRef(cue);

  // Declared before useGSAP, so a set-up in the same commit already reads the new cue.
  useLayoutEffect(() => {
    cueNow.current = cue;
    if (tween.current) applyCue(tween.current, cue);
  }, [cue]);

  useGSAP(
    (context) => {
      const el = heading.current;
      if (mode !== "full" || !el) return;
      const originals = Array.from(el.childNodes);
      let split: SplitText | null = null;
      let restored = false;
      const restore = () => {
        if (restored) return;
        restored = true;
        tween.current = null;
        try {
          split?.revert();
        } finally {
          el.replaceChildren(...originals);
        }
      };
      el.replaceChildren(...originals.map((node) => node.cloneNode(true)));
      try {
        context.ignore(() => {
          split = new SplitText(el, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            onSplit: (self) => {
              split = self;
              // paused still renders the start state at once (a from tween renders immediately).
              const t = gsap.from(self.lines, {
                yPercent: 100,
                duration: DURATION.title,
                stagger: STAGGER,
                ease: HOUSE_EASE,
                paused: true,
                onComplete: restore,
              });
              tween.current = t;
              applyCue(t, cueNow.current);
              return t;
            },
          });
        });
      } catch (error) {
        restore();
        throw error;
      }
      return restore;
    },
    { scope: heading, dependencies: [mode], revertOnUpdate: true },
  );

  return (
    <h1 ref={heading} id={id} data-reveal className={className}>
      {children}
    </h1>
  );
}
