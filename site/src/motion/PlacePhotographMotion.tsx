"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MOTION_QUERY, pinStart, useGSAP } from "./gsap";
import { useMotionMode } from "./MotionProvider";

// Beat 2's pin wrapper. In full motion at the breakpoint it pins for one viewport height and
// moves the decorative layers ([data-layer]) by different amounts. Nothing else moves.
const LAYER_TRAVEL: [layer: string, yPercent: number][] = [
  ["1", -15],
  ["2", -35],
  ["3", -60],
];

export function PlacePhotographMotion({ children }: { children: ReactNode }) {
  const { mode } = useMotionMode();
  const wrapper = useRef<HTMLDivElement>(null);

  useGSAP(
    (context) => {
      if (mode !== "full") return;
      // useGSAP records the matchMedia and reverts it on a mode change, once. Its set-up runs
      // outside useGSAP's context (ignore): run inside, its context became a child whose tweens
      // were reverted twice, and the second revert wrote the fromTo start values back inline
      // (traced in Chrome). A media-query change reverts it once, the same way.
      const mm = gsap.matchMedia(wrapper.current ?? undefined);
      context.ignore(() =>
        mm.add(MOTION_QUERY, () => {
          const tl = gsap.timeline({
            scrollTrigger: { trigger: wrapper.current, pin: true, start: pinStart, end: "+=100%", scrub: 0.5 },
          });
          for (const [layer, yPercent] of LAYER_TRAVEL) {
            tl.fromTo(`[data-layer="${layer}"]`, { yPercent: 0 }, { yPercent, ease: "none", duration: 1 }, 0);
          }
        }),
      );
    },
    { scope: wrapper, dependencies: [mode], revertOnUpdate: true },
  );

  return (
    <div ref={wrapper} className="grid gap-8 lg:grid-cols-[1fr_8rem]">
      {children}
    </div>
  );
}
