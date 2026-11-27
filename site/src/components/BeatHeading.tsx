import type { ReactNode } from "react";
import { SECTION_LABELS, sectionNumber, type Beat } from "./story";

// A section's opening, like a catalogue entry: the beat number (decoration only: the heading
// already names the section), the heading, then a thin rule unless the beat draws its own.
// The heading's words are the section's label (story.ts), shared with the story bar; before and
// after add to it (a mark, a year).
export function BeatHeading({
  beat,
  rule = true,
  className = "",
  before,
  after,
}: {
  beat: Exclude<Beat, 1>;
  rule?: boolean;
  className?: string;
  before?: ReactNode;
  after?: ReactNode;
}) {
  return (
    <div className={rule ? "opening" : "flex flex-col gap-2"}>
      <p aria-hidden className="caps soft">{sectionNumber(beat)}</p>
      <h2 id={`beat-${beat}-heading`} className={`font-title type-heading ${className}`}>
        {before}
        {SECTION_LABELS[beat]}
        {after}
      </h2>
    </div>
  );
}
