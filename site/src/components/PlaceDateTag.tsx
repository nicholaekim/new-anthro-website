"use client";

import { useRef, useSyncExternalStore } from "react";

// Shows the historical year until the present-day beat (7) reaches the top of the view,
// so it changes only at that beat boundary. Without scripts it shows the historical year.
// It never takes clicks. Below the breakpoint it sits on its own row under the header, at the
// right (the person card button is at the left of that row), so it covers no control; at the
// breakpoint it sits in the header's row, which has room for it.

function subscribe(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  window.addEventListener("resize", onChange);
  return () => {
    window.removeEventListener("scroll", onChange);
    window.removeEventListener("resize", onChange);
  };
}

function presentReached(tag: HTMLElement | null): boolean {
  const boundary = tag?.closest("[data-chapter]")?.querySelector('section[data-beat="7"]');
  if (!boundary) return false;
  const line = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  return boundary.getBoundingClientRect().top <= line + 1;
}

export function PlaceDateTag({ place, historicalYear, presentYear }: { place: string; historicalYear: number; presentYear: number }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const present = useSyncExternalStore(subscribe, () => presentReached(ref.current), () => false);
  return (
    <p
      ref={ref}
      data-place-date-tag
      data-tag-era={present ? "present" : "historical"}
      // Tighter tracking than other labels and no wrapping: the longest tag stays on one line at 320
      // wide, so it never grows past the top scroll padding.
      className="caps pointer-events-none fixed right-2 top-11 z-30 max-w-[calc(100vw-1rem)] whitespace-nowrap border [--caps-track:0.06em] border-rule bg-raised px-2 py-1 text-right text-paper pointer-coarse:top-16 lg:right-4 lg:top-2 lg:border-0 lg:border-l lg:bg-transparent lg:pl-3 lg:pr-0"
    >
      {place}, {present ? presentYear : historicalYear}
    </p>
  );
}
