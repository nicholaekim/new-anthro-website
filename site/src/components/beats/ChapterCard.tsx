import type { Chapter } from "@/content/types";
import { ChapterEntrance } from "@/motion/ChapterEntrance";
import { Reveal } from "@/motion/Reveal";
import { SlotText } from "../SlotText";
import { sectionNumber } from "../story";

// A title page: the title low in the frame, the content note set apart below it. Behind the
// title the year is set in very large, faint figures, and above it the chapter's number; both
// are decoration (the heading and the header's "Chapter N of 4" say the same), hidden from
// assistive technology and marked data-reveal so the pending mark covers them until the
// entrance is set up (ChapterEntrance). The content note is plain text from the first frame.
// Its height and bottom padding are set in globals.css ([data-beat="1"]), from the header and
// story-bar heights. overflow-x-clip: the figures may run past the edge on a narrow screen without widening the page.
export function ChapterCard({ chapter, number }: { chapter: Chapter; number?: number }) {
  return (
    <section
      data-beat="1"
      id="beat-1"
      aria-labelledby="beat-1-heading"
      className="beat relative isolate flex flex-col justify-end gap-10 overflow-x-clip text-paper"
    >
      <ChapterEntrance>
        <div
          aria-hidden
          data-chapter-figures
          data-reveal
          className="pointer-events-none absolute inset-x-0 bottom-[38%] -z-10 select-none text-right font-title text-[clamp(8rem,3rem+20vw,22rem)] font-light leading-none tracking-[-0.04em] text-paper/[0.06] tabular-nums"
        >
          <span className="pr-[max(1.25rem,calc((100%-50rem)/2))]">{chapter.historicalYear}</span>
        </div>
        <div className="flex flex-col gap-5">
          {number !== undefined && (
            <p aria-hidden data-chapter-number data-reveal className="caps soft flex items-center gap-4">
              Chapter {sectionNumber(number)}
              <span data-chapter-rule className="block h-px w-16 origin-left bg-(--hair)" />
            </p>
          )}
          {/* The year is set on its own line; the name says "place, country, year" in one line
              (a hidden comma before it was read with a space before it). */}
          <Reveal
            id="beat-1-heading"
            label={`${chapter.place}, ${chapter.country}, ${chapter.historicalYear}`}
            className="font-title type-display"
          >
            {chapter.place}, {chapter.country}{" "}
            <span className="mt-4 block text-[0.5em] leading-tight tracking-normal text-muted">{chapter.historicalYear}</span>
          </Reveal>
        </div>
        <p className="measure border border-rule px-5 py-4 font-interface text-sm leading-relaxed text-paper">
          <span className="caps soft mb-1 block">Content note:</span> <SlotText value={chapter.contentNote} />
        </p>
      </ChapterEntrance>
    </section>
  );
}
