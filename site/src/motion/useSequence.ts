"use client";

import { useEffect, useRef, useState } from "react";
import { useCover } from "./CoverProvider";
import { gsap, HOUSE_EASE, useGSAP } from "./gsap";
import type { RevealCue } from "./Reveal";

// Marks a control inside a sequence's scope that focus may reach without finishing it (Skip).
export const SEQUENCE_CONTROL = "data-sequence-control";

// A timed entrance that plays once per mount: the opening's sequence and a chapter's title page.
// While enabled it waits for the cover between pages to open, then build adds its tweens to one
// timeline and calls playTitle at the moment the page's title (a Reveal, held until then by the
// returned cue) should rise. On completion, or once finish() is called (Skip, or keyboard focus
// moving onto a part still arriving), the timeline is reverted, so the parts are left exactly as
// the still page has them, with no inline style. If build throws, everything finishes at once.
export function useSequence(
  enabled: boolean,
  build: (tl: gsap.core.Timeline, playTitle: () => void) => void,
  onDone?: () => void,
) {
  const [stage, setStage] = useState<"waiting" | "done" | "finished">("waiting");
  const [titleCue, setTitleCue] = useState<RevealCue>("hold");
  const active = enabled && stage === "waiting";
  const { state: coverState } = useCover();
  const running = active && (coverState === "idle" || coverState === "opening");
  const scope = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const touched = useRef<Element[]>([]);

  function finish() {
    timeline.current?.progress(1);
    onDone?.();
    setStage("finished");
  }

  useGSAP(
    () => {
      if (!running) return;
      const tl = gsap.timeline({
        defaults: { ease: HOUSE_EASE },
        onComplete: () => {
          onDone?.();
          setStage((s) => (s === "waiting" ? "done" : s));
        },
      });
      try {
        build(tl, () => setTitleCue("play"));
      } catch (error) {
        console.error(error);
        tl.progress(1);
        return;
      }
      timeline.current = tl;
      // A call has no element targets; only tweens of elements count.
      touched.current = tl.getChildren(true, true, false).flatMap((t) => (t.targets() as unknown[]).filter((x): x is Element => x instanceof Element));
      const el = scope.current;
      const onFocusIn = (event: FocusEvent) => {
        if (event.target instanceof Element && !event.target.closest(`[${SEQUENCE_CONTROL}]`)) finish();
      };
      el?.addEventListener("focusin", onFocusIn);
      return () => {
        el?.removeEventListener("focusin", onFocusIn);
        timeline.current = null;
      };
    },
    { scope, dependencies: [running], revertOnUpdate: true },
  );

  // The revert (a layout effect) can leave an empty style attribute behind; remove it after.
  useEffect(() => {
    if (running) return;
    for (const el of touched.current) if (el.getAttribute("style") === "") el.removeAttribute("style");
    touched.current = [];
  }, [running]);

  const cue: RevealCue = stage === "finished" ? "finish" : active ? titleCue : "play";
  return { scope, cue, active, finish };
}
