"use client";

import { ScrollTrigger } from "@/motion/gsap";
import { useMotionMode } from "@/motion/MotionProvider";
import { placeAt, scrollForPlace, type Place } from "./story";

// On a chapter page, the sections and the scroll-padding line they are read against.
function measure() {
  const root = document.querySelector("[data-chapter]");
  if (!root) return null;
  const rects = [...root.querySelectorAll("section[data-beat]")].map((s) => s.getBoundingClientRect());
  const line = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  return { tops: rects.map((r) => r.top), heights: rects.map((r) => r.height), line };
}

// Back to the same place once the pins have been made or removed (the page's height changed).
function restore(place: Place) {
  ScrollTrigger.refresh();
  const m = measure();
  if (!m) return;
  const tops = m.tops.map((t) => t + window.scrollY);
  window.scrollTo({ top: scrollForPlace(place, tops, m.heights, m.line), behavior: "instant" });
}

// Pressed while motion is full. The choice overrides the system preference for this visit.
// Switching adds or removes the pins and their spacing, so on a chapter page the reader is kept
// at the same place in the same section: recorded before the switch, restored two frames after
// it, once the set-ups have been rebuilt or reverted.
export function MotionSwitch() {
  const { mode, setMode } = useMotionMode();

  function toggle() {
    const m = measure();
    const place = m && placeAt(m.tops, m.heights, m.line);
    setMode(mode === "full" ? "still" : "full");
    if (place) requestAnimationFrame(() => requestAnimationFrame(() => restore(place)));
  }

  return (
    <button type="button" aria-pressed={mode === "full"} onClick={toggle} className="target quiet px-2 hover:text-interface">
      Motion
    </button>
  );
}
