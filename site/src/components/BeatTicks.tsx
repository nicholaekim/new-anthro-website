"use client";

import type { MouseEvent } from "react";

// Client only because previous and next depend on where the reader is. Every control is a
// plain #beat-N link first, so without scripts the ticks still jump to each beat.
// The search stays inside this chapter: hidden, preserved routes keep the same ids.

type Pick = (sections: HTMLElement[], line: number) => HTMLElement | undefined;

const top = (el: HTMLElement) => el.getBoundingClientRect().top;
const previous: Pick = (s, line) => s.filter((el) => top(el) < line - 1).at(-1);
const following: Pick = (s, line) => s.find((el) => top(el) > line + 1);
const beat = (n: number): Pick => (s) => s.find((el) => el.dataset.beat === String(n));

function moveTo(event: MouseEvent<HTMLAnchorElement>, pick: Pick) {
  const root = event.currentTarget.closest("[data-chapter]");
  if (!root) return;
  event.preventDefault();
  const sections = [...root.querySelectorAll<HTMLElement>("section[data-beat]")];
  const line = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  const target = pick(sections, line);
  if (!target) return;
  target.scrollIntoView({ block: "start" });
  const heading = target.querySelector<HTMLElement>("h1, h2");
  if (!heading) return;
  if (!heading.hasAttribute("tabindex")) heading.setAttribute("tabindex", "-1");
  heading.focus({ preventScroll: true });
}

export function BeatTicks({ beats }: { beats: readonly number[] }) {
  const link = "target justify-center px-2 underline";
  return (
    <nav
      data-beat-ticks
      aria-label="Beats in this chapter"
      className="fixed inset-x-0 bottom-0 z-20 flex flex-wrap items-center justify-center gap-x-2 bg-surround px-2 py-1 font-interface text-xs text-paper"
    >
      <a href={`#beat-${beats[0]}`} onClick={(e) => moveTo(e, previous)} className={link}>
        Previous beat
      </a>
      <ol className="flex">
        {beats.map((n) => (
          <li key={n}>
            <a href={`#beat-${n}`} onClick={(e) => moveTo(e, beat(n))} data-tick={n} className="target justify-center">
              <span aria-hidden className="block h-3 w-0.5 bg-interface" />
              <span className="sr-only">Beat {n}</span>
            </a>
          </li>
        ))}
      </ol>
      <a href={`#beat-${beats[1] ?? beats[0]}`} onClick={(e) => moveTo(e, following)} className={link}>
        Next beat
      </a>
    </nav>
  );
}
