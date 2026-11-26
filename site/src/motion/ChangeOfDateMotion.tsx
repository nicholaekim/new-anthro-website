"use client";

import { useRef, useState, type ReactNode } from "react";
import { EraSwitch } from "@/components/EraSwitch";
import type { Era } from "@/content/types";
import { eraFromProgress, scrollTargetForEra } from "./era";
import { FADE_EASE, gsap, MOTION_QUERY, pinStart, ScrollTrigger, useGSAP } from "./gsap";
import { useMotionMode } from "./MotionProvider";

// Opacity the mount that is not shown fades to when the era switch is pressed in place.
const DIMMED = 0.4;

// Beat 6. Children hold [data-date-line] and [data-stage] with one figure[data-era] each.
// Full motion at the breakpoint: the set-up stacks the two mounts at one position (data-overlap),
// pins for one viewport height and scrubs one timeline (cross-fade, date line); the era switch
// then scrolls to the pin's start or end. Otherwise the mounts stay one after the other and the
// era switch plays a timed cross-fade in place.
export function ChangeOfDateMotion({ presentYear, children }: { presentYear: number; children: ReactNode }) {
  const { mode } = useMotionMode();
  const wrapper = useRef<HTMLDivElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const fade = useRef<((era: Era) => void) | null>(null);
  const [scrubbed, setScrubbed] = useState(false);
  const [scrolledEra, setScrolledEra] = useState<Era>("historical");
  const [chosenEra, setChosenEra] = useState<Era>("historical");

  useGSAP(
    (context) => {
      const el = wrapper.current;
      const stage = el?.querySelector("[data-stage]");
      if (!el || !stage) return;
      const historical = '[data-era="historical"] [data-mount]';
      const present = '[data-era="present"] [data-mount]';
      // useGSAP records the matchMedia and reverts it on a mode change, once. Its set-up runs
      // outside useGSAP's context (ignore): run inside, its context became a child whose tweens
      // were reverted twice, and the second revert wrote the fromTo start values back inline
      // (traced in Chrome). A media-query change reverts it once, the same way.
      const mm = gsap.matchMedia(el);
      // Runs at every width ("all") and re-runs on every crossing of the breakpoint, so a timed
      // fade never outlives its layout and the scrubbed set-up exists only under MOTION_QUERY.
      context.ignore(() =>
        mm.add({ all: "all", wide: MOTION_QUERY }, (media) => {
          if (mode === "full" && media.conditions?.wide) {
            stage.setAttribute("data-overlap", "");
            const sync = (self: ScrollTrigger) => setScrolledEra(eraFromProgress(self.progress));
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: el,
                pin: true,
                start: pinStart,
                end: "+=100%",
                scrub: 0.5,
                onUpdate: sync,
                onRefresh: sync,
              },
            });
            tl.fromTo("[data-date-line]", { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, ease: "none", duration: 1 }, 0)
              .fromTo(historical, { opacity: 1 }, { opacity: 0, ease: "none", duration: 0.4 }, 0.3)
              .fromTo(present, { opacity: 0 }, { opacity: 1, ease: "none", duration: 0.4 }, 0.3);
            trigger.current = tl.scrollTrigger ?? null;
            setScrubbed(true);
          } else {
            fade.current = media.add("fade", (era: Era) => {
              const tween = { duration: 0.6, ease: FADE_EASE, overwrite: "auto" } as const;
              gsap.to(era === "present" ? present : historical, { ...tween, opacity: 1 });
              gsap.to(era === "present" ? historical : present, { ...tween, opacity: DIMMED });
            }) as (era: Era) => void;
          }
          return () => {
            stage.removeAttribute("data-overlap");
            trigger.current = null;
            fade.current = null;
            setScrubbed(false);
            setScrolledEra("historical");
            setChosenEra("historical");
          };
        }),
      );
    },
    { scope: wrapper, dependencies: [mode], revertOnUpdate: true },
  );

  const shown = scrubbed ? scrolledEra : chosenEra;

  function onPress() {
    const next: Era = shown === "present" ? "historical" : "present";
    const st = trigger.current;
    if (st) {
      // Scroll drives the timeline; the switch only moves the page to where that era is shown.
      window.scrollTo(0, scrollTargetForEra(st.start, st.end, next));
      return;
    }
    setChosenEra(next);
    fade.current?.(next);
  }

  return (
    <section data-beat="6" id="beat-6" aria-labelledby="beat-6-heading" data-era-shown={shown} className="p-8">
      <div ref={wrapper} className="flex flex-col gap-6">
        {children}
        <EraSwitch presentYear={presentYear} pressed={shown === "present"} onPress={onPress} />
      </div>
    </section>
  );
}
