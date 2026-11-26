import type { Era } from "@/content/types";

// Beat 6's scrubbed cross-fade: the present day is shown from half way through the pin.
export function eraFromProgress(progress: number): Era {
  return progress >= 0.5 ? "present" : "historical";
}

// Where the era switch scrolls to in full motion: the pin's start or its end.
export function scrollTargetForEra(start: number, end: number, era: Era): number {
  return era === "present" ? end : start;
}
