import type { Era } from "@/content/types";

// Beat 6's comparison runs on one value, its progress: 0 is the historical date, 1 is 2020.
// The range, the year buttons, the wipe, the date indicator, the information panel and, while
// pinned, the scroll position are all this value seen another way. The other way round, a
// scroll position becomes progress with progressBetween (src/components/story.ts).

const clamp = (p: number) => Math.min(1, Math.max(0, p));

// The era in view: the present day from half way.
export function eraFromProgress(progress: number): Era {
  return progress >= 0.5 ? "present" : "historical";
}

// Where a year button scrolls to while pinned: the pin's start or its end.
export function scrollTargetForEra(start: number, end: number, era: Era): number {
  return era === "present" ? end : start;
}

// The whole year progress stands for, between the two dates.
export function yearFromProgress(progress: number, from: number, to: number): number {
  return Math.round(from + clamp(progress) * (to - from));
}

// The progress a year stands for. 0 when the two dates are the same.
export function progressFromYear(year: number, from: number, to: number): number {
  if (to <= from) return 0;
  return clamp((year - from) / (to - from));
}

// The scroll position that shows progress while pinned, between the pin's start and end.
export function scrollForProgress(progress: number, start: number, end: number): number {
  return start + clamp(progress) * (end - start);
}

// The year of the era in view.
export function eraYear(progress: number, from: number, to: number): number {
  return eraFromProgress(progress) === "present" ? to : from;
}

// The range's aria-valuetext: the year in view, after the range's own year when that differs.
export function rangeValueText(year: number, from: number, to: number): string {
  const inView = eraYear(progressFromYear(year, from, to), from, to);
  return year === inView ? `${inView} in view` : `${year}, ${inView} in view`;
}
