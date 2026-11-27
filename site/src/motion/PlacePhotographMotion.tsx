"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MOTION_QUERY, pinStart, useGSAP } from "./gsap";
import { useMotionMode } from "./MotionProvider";
import { scrollTargetForFocus } from "./pinFocus";

// Space left between a control brought into view and the beat bar, in pixels.
const FOCUS_MARGIN = 16;

// Beat 2's pin wrapper. In full motion at the breakpoint it pins for one viewport height and,
// scrubbed, moves the side column's two lines of type ([data-depth], PlacePhotograph) up by
// different amounts, the nearer one further, and lets the backdrop's pool of light
// ([data-backdrop-light], Backdrop) drift a little. The photograph and its sheet stay still.
const DEPTH_TRAVEL: [depth: string, y: number][] = [
  ["far", -56],
  ["near", -150],
];
// The light's drift, in percent of its own size.
const LIGHT_DRIFT = { xPercent: 3, yPercent: -5 };

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
          for (const [depth, y] of DEPTH_TRAVEL) {
            tl.fromTo(`[data-depth="${depth}"]`, { y: 0 }, { y, ease: "none", duration: 1 }, 0);
          }
          // Outside the wrapper, so passed as an element; the revert puts it back too.
          const light = document.querySelector("[data-backdrop-light]");
          if (light) tl.fromTo(light, { xPercent: 0, yPercent: 0 }, { ...LIGHT_DRIFT, ease: "none", duration: 1 }, 0);
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
