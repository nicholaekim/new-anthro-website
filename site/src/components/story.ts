import type { Basis, ConfidenceLevel, Era } from "@/content/types";

// The chapter's sections, named once: the beat headings and the story bar both read this list.
// Beat 1's heading is the chapter's own title, so its label is used by the story bar only.
export const SECTION_LABELS = {
  1: "Title",
  2: "Place",
  3: "Items",
  4: "Basis",
  5: "Outcome",
  6: "Change of date",
  7: "Present day",
  8: "Next",
} as const;

export type Beat = keyof typeof SECTION_LABELS;

export const sectionNumber = (beat: number) => String(beat).padStart(2, "0");

// "04 Basis"
export const sectionTag = (beat: Beat) => `${sectionNumber(beat)} ${SECTION_LABELS[beat]}`;

// The active section: the last whose top is at or above the reading line; the first before any
// is reached. tops are in document order. -1 when there are no sections.
export function activeIndex(tops: readonly number[], line: number): number {
  if (tops.length === 0) return -1;
  let active = 0;
  tops.forEach((top, i) => {
    if (top <= line) active = i;
  });
  return active;
}

// How far value is from start to end, clamped to 0..1. 0 when there is nothing to travel.
export function progressBetween(value: number, start: number, end: number): number {
  if (end <= start) return 0;
  return Math.min(1, Math.max(0, (value - start) / (end - start)));
}

// The sections either side of the active one. An unknown active section counts as the first.
export function neighbours(beats: readonly number[], active: number | null) {
  const i = Math.max(0, active === null ? 0 : beats.indexOf(active));
  return { previous: beats[i - 1] ?? null, next: beats[i + 1] ?? null };
}

// The parts of a chapter the person card reads: which facts each era's rule uses.
export interface FactUses {
  historicalYear: number;
  presentYear: number;
  basis: Pick<Basis, "cardFactsUsed"> | null;
  present: { basis: Pick<Basis, "cardFactsUsed"> | null };
}

// The section that quotes each era's rule.
export const RULE_BEAT: Record<Era, Beat> = { historical: 4, present: 7 };

export interface FactMark {
  era: Era;
  year: number;
  used: boolean;
  label: string;
  beat: Beat;
}

// For one fact, whether each era's rule uses it: "1930: used", "2020: not used".
export function factMarks(c: FactUses, factId: string): FactMark[] {
  const eras: [Era, number, FactUses["basis"]][] = [
    ["historical", c.historicalYear, c.basis],
    ["present", c.presentYear, c.present.basis],
  ];
  return eras.map(([era, year, basis]) => {
    const used = basis?.cardFactsUsed.includes(factId) ?? false;
    return { era, year, used, label: `${year}: ${used ? "used" : "not used"}`, beat: RULE_BEAT[era] };
  });
}

// Which era's facts the person card emphasises while a section is active: the historical rule
// at the basis and the outcome, the era in view at the change of date (none until its comparison
// has been set up), the 2020 rule at the present day, neither elsewhere.
export function emphasisFor(beat: number | null, eraInView: Era | null = null): Era | null {
  if (beat === 4 || beat === 5) return "historical";
  if (beat === 6) return eraInView;
  if (beat === 7) return "present";
  return null;
}

// The facts the rule in view uses while a section is active.
export function factsUsedAt(
  c: Pick<FactUses, "basis" | "present">,
  beat: number | null,
  eraInView: Era | null = null,
): readonly string[] {
  const era = emphasisFor(beat, eraInView);
  if (era === "historical") return c.basis?.cardFactsUsed ?? [];
  if (era === "present") return c.present.basis?.cardFactsUsed ?? [];
  return [];
}

export const CONFIDENCE_LEVELS: readonly ConfidenceLevel[] = ["high", "moderate", "low", "undetermined"];

export const CONFIDENCE_WORDS: Record<ConfidenceLevel, string> = {
  high: "High",
  moderate: "Moderate",
  low: "Low",
  undetermined: "Cannot be determined",
};

// How many of the meter's four steps are filled: four for high, one for cannot be determined.
export const confidenceSteps = (level: ConfidenceLevel) => CONFIDENCE_LEVELS.length - CONFIDENCE_LEVELS.indexOf(level);
