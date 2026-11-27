"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { EraSwitch } from "@/components/EraSwitch";
import { useSetEraInView } from "@/components/StoryProgress";
import type { Era } from "@/content/types";
import { eraFromProgress, progressFromYear, scrollForProgress, scrollTargetForEra, yearFromProgress } from "./era";
import { gsap, HOUSE_EASE, MOTION_QUERY, pinStart, ScrollTrigger, useGSAP } from "./gsap";
import { useMotionMode } from "./MotionProvider";

const ERAS: readonly Era[] = ["historical", "present"];

// clearProps leaves an empty style attribute behind; remove it.
const tidy = (targets: unknown[]) =>
  targets.forEach((t) => {
    if (t instanceof Element && t.getAttribute("style") === "") t.removeAttribute("style");
  });

// How long a year button takes to carry the comparison across when nothing is pinned.
const CROSSING_SECONDS = 1.4;

// Near either end of the wipe, the divider's year label on the outer side would run past the
// frame: hidden while the wipe is within this share of that end (a label and its gap are about
// 3rem, under a sixth of the narrowest frame).
const LABEL_EDGE = 0.16;

// Beat 6. Without its script (and on the server) the two era panels follow one another and none
// of the controls below exists. Once the script runs, at every width and in both modes, it is one
// stage: the two documents in one frame, the information panel of the era in view, a date
// indicator and one control (EraSwitch). Everything follows one value, the progress from the
// historical date (0) to 2020 (1); see era.ts.
// - paint(progress) draws it: the wipe and its divider (--wipe and data-wipe on [data-stage],
//   read by globals.css), the date indicator, and the era in view (the midpoint), which picks
//   the panel, tells the live region and the person card, and fades the panel in, in full motion.
//   If focus is inside the panel being hidden, it moves to the range first (inert would drop it).
//   The live region is quiet while the range has focus: its value text already says the era.
// - swap: when either document has no image, the documents swap at the midpoint instead of
//   wiping, so an empty frame's note is never cut in two.
// - Full motion at the breakpoint: the section pins and scroll scrubs a timeline that paints. The
//   range follows the scroll position itself (not the scrub's eased copy), so dragging it scrolls
//   the page to the matching place and the scroll then sets the range to the year it was given;
//   the year buttons scroll there smoothly.
// - Otherwise nothing pins: the range paints at once, and the year buttons carry the value
//   across with a tween in full motion and at once in still mode. Switching Motion or crossing
//   the breakpoint between two such set-ups keeps the value; leaving the pin returns it to the
//   historical date, since the page is no longer scrolled through the pin.
export function ChangeOfDateMotion({
  historicalYear: from,
  presentYear: to,
  intro,
  eras,
  swap,
}: {
  historicalYear: number;
  presentYear: number;
  intro: ReactNode;
  eras: Record<Era, ReactNode>;
  swap: boolean;
}) {
  const { mode, ready } = useMotionMode();
  const enhanced = ready;
  const wrapper = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const date = useRef<HTMLParagraphElement>(null);
  const pin = useRef<ScrollTrigger | null>(null);
  const cross = useRef<((progress: number) => void) | null>(null);
  const stopCrossing = useRef<(() => void) | null>(null);
  const progress = useRef(0);
  const painted = useRef<Era>("historical");
  const [year, setYear] = useState(from);
  const [eraInView, setEraInView] = useState<Era>("historical");
  const [message, setMessage] = useState("");
  const setStoryEra = useSetEraInView();

  function paint(p: number) {
    // On the stage, not the wrapper: the pin writes and restores the wrapper's own inline style.
    const el = stage.current;
    if (!el) return;
    progress.current = p;
    // At the start nothing is written inline: the page at rest carries no style attribute.
    if (p > 0) el.style.setProperty("--wipe", String(p));
    else el.style.removeProperty("--wipe");
    if (el.style.length === 0) el.removeAttribute("style");
    el.dataset.wipe = p <= 0 ? "start" : p >= 1 ? "end" : "between";
    if (p > 0 && p < LABEL_EDGE) el.dataset.wipeEdge = "start";
    else if (p < 1 && p > 1 - LABEL_EDGE) el.dataset.wipeEdge = "end";
    else delete el.dataset.wipeEdge;
    if (date.current) date.current.textContent = String(yearFromProgress(p, from, to));
    const era = eraFromProgress(p);
    if (era !== painted.current) {
      const leaving = el.querySelector(`[data-era="${painted.current}"]`);
      painted.current = era;
      const range = wrapper.current?.querySelector<HTMLInputElement>("[data-era-control] input");
      if (range && leaving?.contains(document.activeElement)) range.focus({ preventScroll: true });
      setEraInView(era);
      setMessage(range && document.activeElement === range ? "" : `Now showing ${era === "present" ? to : from}.`);
    }
  }

  // Unpinned, the range and the painting are the same value.
  function apply(p: number) {
    paint(p);
    setYear(yearFromProgress(p, from, to));
  }

  useGSAP(
    (context) => {
      const el = wrapper.current;
      if (!el || !enhanced) return;
      // Copies the matchMedia pattern of the other pins: recorded by useGSAP, set up outside its
      // context (ignore), reverted once on a mode change, a breakpoint change or unmount.
      const mm = gsap.matchMedia(el);
      context.ignore(() =>
        mm.add({ all: "all", wide: MOTION_QUERY }, (media) => {
          const pinned = mode === "full" && !!media.conditions?.wide;
          if (pinned) {
            // The scroll position sets the value from here on; it starts from the historical date.
            apply(0);
            el.setAttribute("data-pinned", "");
            const value = { p: 0 };
            const follow = (self: ScrollTrigger) => setYear(yearFromProgress(self.progress, from, to));
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: el,
                pin: true,
                start: pinStart,
                end: "+=150%",
                scrub: 0.6,
                onUpdate: follow,
                onRefresh: follow,
              },
            });
            tl.fromTo(value, { p: 0 }, { p: 1, ease: "none", duration: 1, onUpdate: () => paint(value.p) });
            pin.current = tl.scrollTrigger ?? null;
          } else if (mode === "full") {
            let running: gsap.core.Tween | null = null;
            stopCrossing.current = () => running?.kill();
            cross.current = media.add("cross", (target: number) => {
              running?.kill();
              const value = { p: progress.current };
              running = gsap.to(value, {
                p: target,
                duration: CROSSING_SECONDS * Math.abs(target - value.p),
                ease: HOUSE_EASE,
                onUpdate: () => apply(value.p),
              });
            }) as (progress: number) => void;
          }
          return () => {
            el.removeAttribute("data-pinned");
            pin.current = null;
            cross.current = null;
            stopCrossing.current = null;
            if (pinned) apply(0);
          };
        }),
      );
    },
    { scope: wrapper, dependencies: [mode, enhanced], revertOnUpdate: true },
  );

  // In full motion the panel coming into view rises a little and fades in; the other is hidden at once.
  const faded = useRef<Era>("historical");
  useGSAP(
    () => {
      const before = faded.current;
      faded.current = eraInView;
      if (mode !== "full" || before === eraInView) return;
      const tween = gsap.fromTo(
        `[data-era="${eraInView}"] [data-info]`,
        { opacity: 0, y: 8 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: HOUSE_EASE,
          clearProps: "opacity,transform",
          onComplete: () => tidy(tween.targets()),
        },
      );
      // Reverting (a mode change, or the era changing again) also leaves nothing inline.
      return () => tidy(tween.targets());
    },
    { scope: wrapper, dependencies: [eraInView, mode], revertOnUpdate: true },
  );

  // The era in view is passed to the person card while enhanced.
  useEffect(() => {
    if (enhanced) setStoryEra(eraInView);
  }, [enhanced, eraInView, setStoryEra]);
  useEffect(() => () => setStoryEra(null), [setStoryEra]);

  function onYear(y: number) {
    setYear(y);
    const p = progressFromYear(y, from, to);
    const st = pin.current;
    if (st) {
      window.scrollTo({ top: scrollForProgress(p, st.start, st.end), behavior: "instant" });
      return;
    }
    stopCrossing.current?.();
    paint(p);
  }

  function onEra(era: Era) {
    const st = pin.current;
    if (st) {
      window.scrollTo({ top: scrollTargetForEra(st.start, st.end, era), behavior: "smooth" });
      return;
    }
    const p = era === "present" ? 1 : 0;
    if (cross.current) cross.current(p);
    else apply(p);
  }

  return (
    <section data-beat="6" id="beat-6" aria-labelledby="beat-6-heading" className="beat">
      <div ref={wrapper} data-change-of-date data-enhanced={enhanced ? "" : undefined} className="flex flex-col gap-5">
        <div className="flex items-end justify-between gap-4">
          {intro}
          {enhanced && (
            <p ref={date} aria-hidden data-date-indicator className="font-title font-light leading-none tabular-nums">
              {from}
            </p>
          )}
        </div>
        {/* The rule under the heading; drawn as the section enters, like the others (SectionReveals). */}
        <div aria-hidden data-date-line data-rule />
        {enhanced && (
          <EraSwitch from={from} to={to} year={year} eraInView={eraInView} onYear={onYear} onEra={onEra} />
        )}
        {/* data-enter: the stage rises in as the section enters, in full motion (SectionReveals). */}
        <div ref={stage} data-stage data-swap={swap ? "" : undefined} data-enter className="flex flex-col gap-14">
          {ERAS.map((era) => {
            const hidden = enhanced && era !== eraInView;
            return (
              <div
                key={era}
                data-era={era}
                data-in-view={enhanced ? String(!hidden) : undefined}
                aria-hidden={hidden || undefined}
                inert={hidden}
                className="flex flex-col gap-5"
              >
                {eras[era]}
              </div>
            );
          })}
          {enhanced && (
            <div aria-hidden data-divider>
              <div data-divider-line>
                <span data-divider-label="present">{to}</span>
                <span data-divider-label="historical">{from}</span>
              </div>
            </div>
          )}
        </div>
        {enhanced && (
          <p aria-live="polite" className="sr-only">
            {message}
          </p>
        )}
      </div>
    </section>
  );
}
