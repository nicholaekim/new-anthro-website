import type { Chapter } from "@/content/types";
import { Reveal } from "@/motion/Reveal";
import { SlotText } from "../SlotText";

// A title page: the title low in the frame, the content note set apart below it.
export function ChapterCard({ chapter }: { chapter: Chapter }) {
  return (
    <section
      data-beat="1"
      id="beat-1"
      aria-labelledby="beat-1-heading"
      className="beat flex min-h-svh flex-col justify-end gap-10 text-paper"
    >
      <Reveal id="beat-1-heading" className="font-title type-display">
        {chapter.place}, {chapter.country}
        {/* The year is set on its own line; this keeps the heading's text "place, country, year". */}
        <span className="sr-only">,</span>{" "}
        <span className="mt-4 block text-[0.5em] leading-tight tracking-normal text-muted">{chapter.historicalYear}</span>
      </Reveal>
      <p className="measure border border-rule px-5 py-4 font-interface text-sm leading-relaxed text-paper">
        <span className="caps soft mb-1 block">Content note:</span> <SlotText value={chapter.contentNote} />
      </p>
    </section>
  );
}
