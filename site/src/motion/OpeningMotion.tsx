"use client";

import { useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { useCover } from "./CoverProvider";
import { gsap, HOUSE_EASE, useGSAP } from "./gsap";
import { useMotionMode } from "./MotionProvider";
import { readOpeningSeen, shouldPlayOpening, storeOpeningSeen } from "./opening";
import { RevealCueContext, type RevealCue } from "./Reveal";

const noSubscription = () => () => {};

// The opening page's sequence. In full motion, the first time per visit, one timeline brings the
// decorative light up ([data-opening-light]) and grows the four border bars ([data-opening-bar])
// while the title reveal is held; then the title reveal plays. Skip jumps the timeline to its end
// and finishes the title. The person card and all text stay visible throughout; the timeline only
// sets opacity and scale on the decorations, and reverting it leaves them as the still page has them.
export function OpeningMotion({ children }: { children: ReactNode }) {
  const { mode } = useMotionMode();
  // On the server and during hydration: seen, so nothing plays before the client values are known.
  const seen = useSyncExternalStore(noSubscription, readOpeningSeen, () => true);
  const [stage, setStage] = useState<"decor" | "done" | "skipped">("decor");
  const active = shouldPlayOpening(mode, seen) && stage === "decor";
  // Arriving under the cover (Restart from a chapter), the timeline waits until it opens.
  const { state: coverState } = useCover();
  const running = active && (coverState === "idle" || coverState === "opening");
  const scope = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      if (!running) return;
      const tween = { duration: 0.8, ease: HOUSE_EASE };
      const tl = gsap.timeline({
        onComplete: () => {
          storeOpeningSeen();
          setStage((s) => (s === "decor" ? "done" : s));
        },
      });
      tl.fromTo("[data-opening-light]", { opacity: 0 }, { opacity: 1, duration: 1.2, ease: HOUSE_EASE }, 0)
        .fromTo('[data-opening-bar="x"]', { scaleX: 0 }, { scaleX: 1, ...tween }, 0.4)
        .fromTo('[data-opening-bar="y"]', { scaleY: 0 }, { scaleY: 1, ...tween }, 0.4);
      timeline.current = tl;
      return () => {
        timeline.current = null;
      };
    },
    { scope, dependencies: [running], revertOnUpdate: true },
  );

  function skip() {
    timeline.current?.progress(1);
    storeOpeningSeen();
    setStage("skipped");
    // The button goes away: keep focus on the page, at its heading.
    const heading = scope.current?.querySelector<HTMLElement>("h1");
    if (heading && !heading.hasAttribute("tabindex")) heading.setAttribute("tabindex", "-1");
    heading?.focus();
  }

  const cue: RevealCue = stage === "skipped" ? "finish" : active ? "hold" : "play";

  return (
    <RevealCueContext value={cue}>
      <div ref={scope}>
        {active && (
          <button
            type="button"
            onClick={skip}
            className="target fixed bottom-4 right-4 z-30 bg-surround px-2 font-interface text-paper underline"
          >
            Skip
          </button>
        )}
        {children}
      </div>
    </RevealCueContext>
  );
}
