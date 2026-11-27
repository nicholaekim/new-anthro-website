"use client";

import { useEffect, useRef, useState } from "react";
import { useCover } from "./CoverProvider";
import { gsap, HOUSE_EASE, useGSAP } from "./gsap";
import type { RevealCue } from "./Reveal";

// Marks a control inside a sequence's scope that focus may reach without finishing it (Skip).
export const SEQUENCE_CONTROL = "data-sequence-control";

// Focus the page's title in scope (a control that goes away when the sequence ends: Skip).
export function focusTitle(scope: HTMLElement | null) {
  const heading = scope?.querySelector<HTMLElement>("h1");
  if (!heading) return;
  if (!heading.hasAttribute("tabindex")) heading.setAttribute("tabindex", "-1");
  heading.focus();
}

const onSequenceControl = (el: Element | null) => !!el?.closest(`[${SEQUENCE_CONTROL}]`);

// A timed entrance that plays once per mount: the opening's sequence and a chapter's title page.
// While enabled it waits for the cover between pages to open, then build adds its tweens to one
// timeline and calls playTitle at the moment the page's title (a Reveal, held until then by the
// returned cue) should rise. On completion, or once finish() is called (Skip, or keyboard focus
// moving onto a part still arriving), the timeline is reverted, so the parts are left exactly as
// the still page has them, with no inline style. If build throws, everything finishes at once.
// If focus is already on a part when it would start (a reader tabbed in before scripts ran),
// nothing plays. A sequence control (Skip) goes away when the sequence ends: if it has focus
// then, focus moves to the page's title instead of being dropped.
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
      const el = scope.current;
      const focused = document.activeElement;
      if (el && focused && el.contains(focused) && !onSequenceControl(focused)) {
        onDone?.();
        setStage("finished");
        return;
      }
      const tl = gsap.timeline({
        defaults: { ease: HOUSE_EASE },
        onComplete: () => {
          if (onSequenceControl(document.activeElement)) focusTitle(el);
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
      const onFocusIn = (event: FocusEvent) => {
        if (event.target instanceof Element && !onSequenceControl(event.target)) finish();
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
