"use client";

import { useRef, useSyncExternalStore } from "react";

// Shows the historical year until the present-day beat (7) reaches the top of the view,
// so it changes only at that beat boundary. Without scripts it shows the historical year.

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
      className="fixed right-4 top-2 z-30 max-w-[50vw] text-right font-interface text-xs text-paper"
    >
      {place}, {present ? presentYear : historicalYear}
    </p>
  );
}
