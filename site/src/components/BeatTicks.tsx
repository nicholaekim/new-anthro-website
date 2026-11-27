"use client";

import { useRef, type MouseEvent } from "react";
import { neighbours, SECTION_LABELS, sectionTag, stepIndex, type Beat } from "./story";
import { useActiveBeat, useChapterProgressEffect } from "./StoryProgress";
import { useDismiss } from "./useDismiss";

// The story bar: one row at every width. Previous, the ticks (from 768px; narrower, on touch,
// eight 44px ticks and the labels would not fit one row), the current section's
// label, which opens the list of sections, and next; a thin line along the top edge shows the
// progress through the chapter. Every control is a plain #beat-N link or a native disclosure
// first, so without scripts the ticks and the list still jump to each section.
// Its height: 2rem (a 24px row and 0.5rem of padding), 3.25rem on touch (44px targets); the
// hairline is a shadow and the progress line sits inside it, so neither adds height. The pins,
// the chapter's bottom padding and scroll-padding-bottom in globals.css allow for these heights.

// A click that opens a new tab or window, or any button but the main one, is the browser's.
const modified = (e: MouseEvent) => e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;

// beat: a section, or a step (previous or next) worked out from where the page is now.
function goTo(event: MouseEvent<HTMLAnchorElement>, beat: number | "previous" | "next") {
  const root = event.currentTarget.closest("[data-chapter]");
  if (!root || modified(event)) return;
  event.preventDefault();
  const sections = [...root.querySelectorAll<HTMLElement>("section[data-beat]")];
  let target: HTMLElement | undefined;
  if (typeof beat === "string") {
    const line = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    target = sections[stepIndex(sections.map((s) => s.getBoundingClientRect().top), line, beat === "next" ? 1 : -1)];
  } else {
    target = sections.find((s) => s.dataset.beat === String(beat));
  }
  // Previous at the first section and next at the last do nothing.
  if (!target) return;
  target.scrollIntoView({ block: "start" });
  const heading = target.querySelector<HTMLElement>("h1, h2");
  if (!heading) return;
  if (!heading.hasAttribute("tabindex")) heading.setAttribute("tabindex", "-1");
  heading.focus({ preventScroll: true });
}

const label = (beat: number) => SECTION_LABELS[beat as Beat];
const tag = (beat: number) => sectionTag(beat as Beat);

export function BeatTicks({ beats }: { beats: readonly number[] }) {
  const { activeBeat } = useActiveBeat();
  const { previous, next } = neighbours(beats, activeBeat);
  const known = activeBeat !== null;
  const line = useRef<HTMLDivElement>(null);
  const { ref: list, onKeyDown, onBlur } = useDismiss();

  useChapterProgressEffect((progress) => {
    if (line.current) line.current.style.transform = `scaleX(${progress})`;
  });

  // The list closes when one of its links is chosen, and as useDismiss says.
  function choose(event: MouseEvent<HTMLAnchorElement>, beat: number) {
    const details = event.currentTarget.closest("details");
    if (details && !modified(event)) details.open = false;
    goTo(event, beat);
  }

  const step = "target quiet justify-center gap-1 px-2 no-underline hover:text-interface aria-disabled:cursor-default aria-disabled:text-muted aria-disabled:no-underline";
  return (
    <nav
      data-beat-ticks
      aria-label="Sections in this chapter"
      className="fixed inset-x-0 bottom-0 z-20 bg-raised font-interface text-xs text-paper shadow-[0_-1px_0_var(--color-rule)]"
    >
      {/* Decoration: the same progress is in the section label. Starts empty without scripts. */}
      <div ref={line} aria-hidden data-progress className="absolute inset-x-0 top-0 h-0.5 origin-left bg-interface [transform:scaleX(0)]" />
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-2 px-2 py-1">
        <a
          href={`#beat-${previous ?? beats[0]}`}
          aria-disabled={known && previous === null ? true : undefined}
          onClick={(e) => goTo(e, "previous")}
          className={step}
        >
          <span aria-hidden>←</span>
          <span aria-hidden className="max-sm:hidden">Previous</span>
          <span className="sr-only">Previous section</span>
        </a>
        <div className="flex min-w-0 items-center gap-3">
          <ol className="hidden items-center md:flex">
            {beats.map((n) => (
              <li key={n}>
                <a
                  href={`#beat-${n}`}
                  onClick={(e) => goTo(e, n)}
                  data-tick={n}
                  aria-current={n === activeBeat ? "step" : undefined}
                  className="group target justify-center"
                >
                  {/* A thin bar; the active section's is a wider, taller block in paper. */}
                  <span
                    aria-hidden
                    className="block h-3 w-0.5 bg-interface group-hover:bg-paper group-aria-[current=step]:h-4 group-aria-[current=step]:w-2 group-aria-[current=step]:bg-paper"
                  />
                  <span className="sr-only">{label(n)}</span>
                </a>
              </li>
            ))}
          </ol>
          <details ref={list} data-section-list className="relative" onKeyDown={onKeyDown} onBlur={onBlur}>
            <summary className="target quiet list-none gap-2 whitespace-nowrap px-2 no-underline hover:text-interface [&::-webkit-details-marker]:hidden">
              {known && <span className="sr-only">Sections, current: </span>}
              <span className="caps [--caps-track:0.08em]">{known ? tag(activeBeat) : "Sections"}</span>
              {/* On a phone the ticks are a compact strip here, decoration only; the list holds the links. */}
              <span aria-hidden className="hidden items-center gap-1 min-[400px]:flex md:hidden">
                {beats.map((n) => (
                  <span key={n} className={n === activeBeat ? "h-3 w-1.5 bg-paper" : "h-2 w-px bg-interface"} />
                ))}
              </span>
              <span aria-hidden className="soft">▴</span>
            </summary>
            <ol className="absolute bottom-full left-1/2 mb-2 flex min-w-52 -translate-x-1/2 flex-col border border-rule bg-raised p-1 shadow-[0_-18px_40px_-16px_rgb(0_0_0/0.8)]">
              {beats.map((n) => (
                <li key={n}>
                  <a
                    href={`#beat-${n}`}
                    onClick={(e) => choose(e, n)}
                    // The ticks carry the one current step; here it is the current place in the list.
                    aria-current={n === activeBeat ? "location" : undefined}
                    className="target quiet w-full gap-2 px-2 text-sm no-underline hover:text-interface aria-[current=location]:font-semibold aria-[current=location]:text-interface"
                  >
                    {/* The current section is marked by a block as well as by tone. */}
                    <span aria-hidden className={`block size-2 ${n === activeBeat ? "bg-interface" : "border border-current/45"}`} />
                    {tag(n)}
                  </a>
                </li>
              ))}
            </ol>
          </details>
        </div>
        <a
          href={`#beat-${next ?? beats.at(-1)}`}
          aria-disabled={known && next === null ? true : undefined}
          onClick={(e) => goTo(e, "next")}
          className={step}
        >
          <span aria-hidden className="max-sm:hidden">Next</span>
          <span className="sr-only">Next section</span>
          <span aria-hidden>→</span>
        </a>
      </div>
    </nav>
  );
}
