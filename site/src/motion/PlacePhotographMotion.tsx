"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MOTION_QUERY, pinStart, useGSAP } from "./gsap";
import { useMotionMode } from "./MotionProvider";
import { scrollTargetForFocus } from "./pinFocus";

// Space left between a control brought into view and the beat bar, in pixels.
const FOCUS_MARGIN = 16;

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
      const el = wrapper.current;
      if (!el) return;
      const mm = gsap.matchMedia(el);
      context.ignore(() =>
        mm.add(MOTION_QUERY, () => {
          const tl = gsap.timeline({
            scrollTrigger: { trigger: el, pin: true, start: pinStart, end: "+=100%", scrub: 0.5 },
          });
          for (const [layer, yPercent] of LAYER_TRAVEL) {
            tl.fromTo(`[data-layer="${layer}"]`, { yPercent: 0 }, { yPercent, ease: "none", duration: 1 }, 0);
          }
          // The pinned wrapper is taller than the view: a control focused below the visible slot
          // is brought into view by scrolling to where it shows once the pin has ended.
          // Checked a frame later, after the browser's own scroll to the focused element, which can
          // itself move the page into the pin. The element's place in the pin is measured from the
          // wrapper's top, which sits at the slot's top while pinned, so a pin not yet updated for
          // that scroll does not matter.
          let frame = 0;
          const onFocusIn = (event: FocusEvent) => {
            const focused = event.target;
            if (!(focused instanceof Element)) return;
            // The close view is a dialog in the top layer: its controls are placed by the view,
            // not by the pin, so focus inside it must not move the page behind it.
            if (focused.closest("dialog")) return;
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
              const st = tl.scrollTrigger;
              if (!st || window.scrollY < st.start || window.scrollY > st.end) return;
              const slot = {
                top: document.querySelector("body > header")?.getBoundingClientRect().bottom ?? 0,
                bottom: document.querySelector("[data-beat-ticks]")?.getBoundingClientRect().top ?? window.innerHeight,
              };
              const box = focused.getBoundingClientRect();
              const offset = box.top - el.getBoundingClientRect().top;
              const inPin = { top: slot.top + offset, bottom: slot.top + offset + box.height };
              const target = scrollTargetForFocus(inPin, slot, st.end, FOCUS_MARGIN);
              if (target !== null) window.scrollTo(0, target);
            });
          };
          el.addEventListener("focusin", onFocusIn);
          return () => {
            cancelAnimationFrame(frame);
            el.removeEventListener("focusin", onFocusIn);
          };
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
