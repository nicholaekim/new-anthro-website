"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { clearCount, subscribeClears } from "@/lib/storage";
import { DURATION, RISE } from "./gsap";
import { useMotionMode } from "./MotionProvider";
import { readOpeningSeen, shouldPlayOpening, storeOpeningSeen } from "./opening";
import { RevealCueContext } from "./Reveal";
import { SEQUENCE_CONTROL, useSequence } from "./useSequence";

const noSubscription = () => () => {};

// When each part of the opening arrives, in seconds from the start: the light comes up, the title
// rises line by line, the framing follows, the person card is set down and its border draws
// around it, then the note and the way in.
const AT = { title: 0.3, framing: 1.0, card: 1.5, border: 1.75, note: 2.35, begin: 2.55 } as const;

// The opening page's sequence (see useSequence). In full motion, the first time per visit: the
// decorative light ([data-opening-light]) and border ([data-opening-bar]) and the parts marked
// [data-opening-part] (framing, card, note, begin) arrive in turn around the title's reveal.
// Only opacity and transform move: every part is in the accessibility tree and reachable by
// keyboard throughout, and focus landing on one finishes the sequence. Skip finishes it too and
// keeps focus on the page, at its heading. Reverted at the end, so nothing inline is left.
// Restart clears what is stored; on the opening page itself that is not a remount, so start the
// sequence again by remounting it.
export function OpeningMotion({ children }: { children: ReactNode }) {
  const generation = useSyncExternalStore(subscribeClears, clearCount, () => 0);
  return <OpeningSequence key={generation}>{children}</OpeningSequence>;
}

function OpeningSequence({ children }: { children: ReactNode }) {
  const { mode } = useMotionMode();
  // On the server and during hydration: seen, so nothing plays before the client values are known.
  const seen = useSyncExternalStore(noSubscription, readOpeningSeen, () => true);
  const { scope, cue, active, finish } = useSequence(
    shouldPlayOpening(mode, seen),
    (tl, playTitle) => {
      const part = (name: string) => `[data-opening-part="${name}"]`;
      const arrive = { opacity: 1, y: 0, duration: DURATION.enter };
      tl.fromTo("[data-opening-light]", { opacity: 0 }, { opacity: 1, duration: DURATION.light }, 0)
        .call(playTitle, [], AT.title)
        .fromTo(part("framing"), { opacity: 0, y: RISE }, arrive, AT.framing)
        // Set down: it settles onto the page from just above.
        .fromTo(part("card"), { opacity: 0, y: -RISE }, { ...arrive, duration: DURATION.title }, AT.card)
        .fromTo('[data-opening-bar="x"]', { scaleX: 0 }, { scaleX: 1, duration: DURATION.enter }, AT.border)
        .fromTo('[data-opening-bar="y"]', { scaleY: 0 }, { scaleY: 1, duration: DURATION.enter }, AT.border)
        .fromTo(part("note"), { opacity: 0 }, { opacity: 1, duration: DURATION.part }, AT.note)
        .fromTo(part("begin"), { opacity: 0, y: RISE / 2 }, { ...arrive, duration: DURATION.part }, AT.begin);
    },
    storeOpeningSeen,
  );

  function skip() {
    finish();
    // The button goes away: keep focus on the page, at its heading.
    const heading = scope.current?.querySelector<HTMLElement>("h1");
    if (heading && !heading.hasAttribute("tabindex")) heading.setAttribute("tabindex", "-1");
    heading?.focus();
  }

  return (
    <RevealCueContext value={cue}>
      <div ref={scope}>
        {active && (
          <button
            type="button"
            onClick={skip}
            {...{ [SEQUENCE_CONTROL]: "" }}
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
