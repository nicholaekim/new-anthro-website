"use client";

import { useRef, type ReactNode } from "react";
import { startsBelowView } from "./entrance";
import { DURATION, gsap, HOUSE_EASE, RISE, ScrollTrigger, STAGGER, useGSAP } from "./gsap";
import { useMotionMode } from "./MotionProvider";

// Marks an element while its entrance is set up and not yet finished (and lets print show it).
const ENTERING = "data-entering";
// When an entrance starts: the element's top passing this line of the view.
const START = "top 90%";

type Entrance = { trigger: HTMLElement; targets: HTMLElement[]; opening: boolean; image: boolean };

// A section's entrances: its opening (number, heading, rule: [data-beat-opening]'s children and
// any [data-rule] of the section, such as beat 6's), then each block that follows the opening
// beside it, and anything marked [data-enter].
function entrancesOf(section: HTMLElement): Entrance[] {
  const opening = section.querySelector<HTMLElement>("[data-beat-opening]");
  if (!opening) return [];
  const parts = new Set([...opening.children, ...section.querySelectorAll("[data-rule]")]);
  const blocks = new Set<Element>();
  for (let el = opening.nextElementSibling; el; el = el.nextElementSibling) blocks.add(el);
  section.querySelectorAll("[data-enter]").forEach((el) => blocks.add(el));
  const html = (els: Iterable<Element>) => [...els].filter((el): el is HTMLElement => el instanceof HTMLElement);
  return [
    { trigger: opening, targets: html(parts), opening: true, image: false },
    // A block that holds a sourced image (a photograph or a document's scan) only fades in: the
    // image is never moved.
    ...html(blocks).map((el) => ({ trigger: el, targets: [el], opening: false, image: !!el.querySelector("[data-mount] img") })),
  ];
}

// clearProps can leave an empty style attribute behind; remove it.
function tidy(el: HTMLElement) {
  el.removeAttribute(ENTERING);
  if (el.getAttribute("style") === "") el.removeAttribute("style");
}

// The chapter's <main>. In full motion, as each section after the title page enters, its number,
// heading and rule arrive in turn, then each block of its content rises a little and fades in,
// once (a block holding a sourced image only fades). Only what starts below the view is touched:
// whatever is in view (or already passed) when this is set up is left as it is, so nothing
// visible is ever hidden. Start states are written by
// the tweens as they are made, never by CSS, and only opacity and transform move, so everything
// stays in the accessibility tree and reachable by keyboard. Nothing is left hidden: focus moving
// into a block not yet in finishes it at once, and reaching the end of the page plays any left
// (a block too near the end for its start line to be reached), and a trigger jumped straight
// past finishes at once. A finished entrance leaves no
// inline style. Transforms do not change layout, so the pins' measured heights are untouched.
// Copies the other set-ups' pattern: made outside useGSAP's context (ignore) in a context of its
// own, reverted once on a mode change or unmount, and on any error during set-up.
export function SectionReveals({ className, children }: { className?: string; children: ReactNode }) {
  const { mode } = useMotionMode();
  const main = useRef<HTMLElement>(null);

  useGSAP(
    (context) => {
      const root = main.current;
      if (mode !== "full" || !root) return;
      // Every position is read first, then everything is written: one layout pass.
      const view = window.innerHeight;
      const entrances = [...root.querySelectorAll<HTMLElement>("section[data-beat]:not([data-beat='1'])")]
        .flatMap(entrancesOf)
        .filter((e) => e.targets.length > 0 && startsBelowView(e.trigger.getBoundingClientRect().top, view));
      if (entrances.length === 0) return;

      const pending = new Map<gsap.core.Animation, HTMLElement[]>();
      const finish = (anim: gsap.core.Animation, run: (a: gsap.core.Animation) => void) => {
        if (!pending.has(anim)) return;
        anim.scrollTrigger?.kill(false, true); // keep the animation
        run(anim);
      };
      // A throw inside a context's function would leave GSAP's current context set to it, so
      // the error is caught inside and handled once the context exists.
      let local: gsap.Context | null = null;
      let failed: unknown = null;
      const undo = () => {
        local?.revert();
        entrances.forEach((e) => e.targets.forEach(tidy));
      };
      context.ignore(() => {
        local = gsap.context(() => {
          try {
            for (const e of entrances) pending.set(enter(e), e.targets);
            ScrollTrigger.create({
              start: () => ScrollTrigger.maxScroll(window) - 1,
              once: true,
              onEnter: () => [...pending.keys()].forEach((a) => finish(a, (x) => x.play())),
            });
          } catch (error) {
            failed = error;
          }
        });
      });
      // Once finished, an entrance writes nothing more and is forgotten.
      function enter(e: Entrance): gsap.core.Animation {
        e.targets.forEach((t) => t.setAttribute(ENTERING, ""));
        const done = () => {
          pending.delete(anim);
          e.targets.forEach(tidy);
        };
        // A jump straight past the trigger (the story bar from section 1 to 7) is finished at
        // once rather than played out of sight, so nothing above the reader is left see-through,
        // whatever ScrollTrigger does with the jump. Checked on enter: with once, ScrollTrigger
        // kills the trigger before it would call onLeave for a jump, so onLeave never runs then.
        const scrollTrigger = {
          trigger: e.trigger,
          start: START,
          once: true,
          onEnter: (self: ScrollTrigger) => {
            if (self.progress >= 1) self.animation?.progress(1);
          },
        };
        const anim: gsap.core.Animation = e.opening
          ? e.targets.reduce(
              (tl, t, i) =>
                tl.from(t, t.hasAttribute("data-rule") ? { scaleX: 0 } : { opacity: 0, y: RISE / 2 }, i * STAGGER * 1.5),
              gsap.timeline({
                scrollTrigger,
                defaults: { duration: DURATION.part, ease: HOUSE_EASE, clearProps: "opacity,transform" },
                onComplete: done,
              }),
            )
          : gsap.from(e.targets, {
              opacity: 0,
              ...(e.image ? {} : { y: RISE }),
              duration: DURATION.enter,
              delay: STAGGER * 2,
              ease: HOUSE_EASE,
              clearProps: "opacity,transform",
              scrollTrigger,
              onComplete: done,
            });
        return anim;
      }
      if (failed !== null) {
        // Whatever went wrong, the page is left as the still version has it, and keeps working.
        undo();
        console.error(failed);
        return;
      }

      const onFocusIn = (event: FocusEvent) => {
        const focused = event.target;
        if (!(focused instanceof Node)) return;
        for (const [anim, targets] of pending) {
          if (targets.some((t) => t.contains(focused))) finish(anim, (a) => a.progress(1));
        }
      };
      root.addEventListener("focusin", onFocusIn);
      return () => {
        root.removeEventListener("focusin", onFocusIn);
        undo();
      };
    },
    { scope: main, dependencies: [mode], revertOnUpdate: true },
  );

  return (
    <main ref={main} className={className}>
      {children}
    </main>
  );
}
