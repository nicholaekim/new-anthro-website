"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type { Era } from "@/content/types";
import { gsap, HOUSE_EASE, useGSAP } from "@/motion/gsap";
import { useMotionMode } from "@/motion/MotionProvider";
import { emphasisFor } from "./story";
import { useActiveBeat } from "./StoryProgress";

// Wraps the person card's facts. Sets data-emphasis to the era whose rule is in view (see
// emphasisFor); globals.css draws the bar and the stronger label on the facts that rule uses
// ([data-uses-historical], [data-uses-present]). In full motion the bars grow in and out with a
// short tween and are left with no inline style; in still mode the emphasis just switches.
export function CardEmphasis({ children }: { children: ReactNode }) {
  const { activeBeat, eraInView } = useActiveBeat();
  const { mode } = useMotionMode();
  const emphasis = emphasisFor(activeBeat, eraInView);
  const ref = useRef<HTMLDivElement>(null);
  const shown = useRef<Era | null>(null);

  useGSAP(
    () => {
      const before = shown.current;
      shown.current = emphasis;
      const el = ref.current;
      if (mode !== "full" || before === emphasis || !el) return;
      const bars = (era: Era | null) => (era ? [...el.querySelectorAll(`[data-uses-${era}] [data-fact-bar]`)] : []);
      const on = bars(emphasis);
      const off = bars(before).filter((b) => !on.includes(b));
      const tween = { ease: HOUSE_EASE, clearProps: "transform" };
      if (on.length) gsap.fromTo(on, { scaleY: 0 }, { ...tween, scaleY: 1, duration: 0.35 });
      if (off.length) gsap.fromTo(off, { scaleY: 1 }, { ...tween, scaleY: 0, duration: 0.25 });
    },
    { scope: ref, dependencies: [emphasis, mode], revertOnUpdate: true },
  );

  // If the card is taller than its column (a short window), bring the first emphasised fact into
  // view inside the card's own scroller, never the page: smooth in full motion, at once in still.
  useEffect(() => {
    const el = ref.current;
    const scroller = el?.closest<HTMLElement>("[data-person-card]");
    const fact = emphasis ? el?.querySelector<HTMLElement>(`[data-uses-${emphasis}]`) : null;
    if (!scroller || !fact || scroller.clientHeight === 0 || scroller.scrollHeight <= scroller.clientHeight) return;
    const box = scroller.getBoundingClientRect();
    const r = fact.getBoundingClientRect();
    if (r.top >= box.top && r.bottom <= box.bottom) return;
    scroller.scrollTo({ top: scroller.scrollTop + r.top - box.top - 8, behavior: mode === "full" ? "smooth" : "auto" });
  }, [emphasis, mode]);

  return (
    <div ref={ref} data-emphasis={emphasis ?? undefined}>
      {children}
    </div>
  );
}
