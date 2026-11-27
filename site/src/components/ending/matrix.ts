import type { Text } from "@/content/slot";
import type { Chapter, ConfidenceLevel, Era } from "@/content/types";
import { RULE_BEAT, type Beat } from "../story";

// The ending's comparison: four places down, two dates across, one view at a time.
export type MatrixView = "decides" | "evidence" | "outcome";

export const MATRIX_VIEWS: readonly { view: MatrixView; label: string }[] = [
  { view: "decides", label: "Who decides" },
  { view: "evidence", label: "On what evidence" },
  { view: "outcome", label: "Outcome and confidence" },
];

// What one cell shows, and the chapter section it summarises.
export type Cell =
  | { kind: "text"; text: Text; beat: Beat }
  // The outcome with its written confidence statement and its citation, as the chapter gives them.
  | { kind: "outcome"; level: ConfidenceLevel; text: Text; confidence: Text; citation: Text; beat: Beat }
  // No outcome: the change of date says that no person is placed in the chapter.
  | { kind: "none"; beat: Beat };

// The sections that give each era's outcome.
const OUTCOME_BEAT: Record<Era, Beat> = { historical: 5, present: 7 };

export function matrixCell(c: Pick<Chapter, "summary" | "outcome" | "present">, era: Era, view: MatrixView): Cell {
  if (view === "outcome") {
    const outcome = era === "historical" ? c.outcome : c.present.outcome;
    if (!outcome) return { kind: "none", beat: 6 };
    const { level, text, confidence, citation } = outcome;
    return { kind: "outcome", level, text, confidence, citation, beat: OUTCOME_BEAT[era] };
  }
  return { kind: "text", text: c.summary[era][view], beat: RULE_BEAT[era] };
}

export const cellHref = (slug: string, beat: Beat) => `/chapters/${slug}#beat-${beat}`;
