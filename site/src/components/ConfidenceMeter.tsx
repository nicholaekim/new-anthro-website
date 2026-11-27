import type { ConfidenceLevel } from "@/content/types";
import { confidenceSteps } from "./story";

// Four steps rising left to right: filled up to the level, hollow after it, so the level reads by
// shape as well as by the word that always stands beside it (CONFIDENCE_WORDS). Decoration only.
const HEIGHTS = ["h-1.5", "h-2", "h-2.5", "h-3"];

export function ConfidenceMeter({ level }: { level: ConfidenceLevel }) {
  const filled = confidenceSteps(level);
  return (
    <span aria-hidden data-meter={level} className="inline-flex items-end gap-0.5">
      {HEIGHTS.map((h, i) => (
        <span key={h} className={`w-1.5 ${h} ${i < filled ? "bg-current" : "border border-current/60"}`} />
      ))}
    </span>
  );
}
