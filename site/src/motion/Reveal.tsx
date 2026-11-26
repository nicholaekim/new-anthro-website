"use client";

import { useRef, type ReactNode } from "react";
import { gsap, HOUSE_EASE, SplitText, useGSAP } from "./gsap";
import { useMotionMode } from "./MotionProvider";

// A page's h1. In full motion its lines rise into place behind a mask. SplitText's default aria
// handling labels the h1 with its text and hides the line pieces, so the accessible name is the
// same before, during and after. autoSplit re-splits when fonts load or the width changes, and
// the tween is rebuilt in onSplit and returned, so SplitText carries its progress across.
// The set-up runs outside useGSAP's context (ignore), so the tween is reverted once, by the
// split's own revert, never a second time by the context (see ChangeOfDateMotion).
export function Reveal({ children, className, id }: { children: ReactNode; className?: string; id?: string }) {
  const { mode } = useMotionMode();
  const heading = useRef<HTMLHeadingElement>(null);

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
          onSplit: (self) => gsap.from(self.lines, { yPercent: 100, duration: 0.9, stagger: 0.08, ease: HOUSE_EASE }),
        });
      });
      return () => split?.revert();
    },
    { scope: heading, dependencies: [mode], revertOnUpdate: true },
  );

  return (
    <h1 ref={heading} id={id} data-reveal className={className}>
      {children}
    </h1>
  );
}
