import type { Chapter } from "@/content/types";
import { PlacePhotographMotion } from "@/motion/PlacePhotographMotion";
import { BeatHeading } from "../BeatHeading";
import { ItemView } from "../ItemView";
import { SlotText } from "../SlotText";

// The side column, at the breakpoint only, holds the place and the year set large and upright:
// typography, not imagery, so it reads the same whether or not the chapter has a photograph
// (Tobique shows an empty frame with its note). It is decoration, hidden from assistive
// technology: the heading, the header and the title page already say both. In full motion the
// two lines drift at different rates while the photograph's sheet stays still (PlacePhotographMotion).
// The photograph itself is never moved, cropped or covered.
export function PlacePhotograph({ chapter }: { chapter: Chapter }) {
  return (
    <section data-beat="2" id="beat-2" aria-labelledby="beat-2-heading" className="beat">
      <PlacePhotographMotion>
        {/* pt-4 keeps the section number off the header's hairline while pinned (see globals.css). */}
        <div className="flex flex-col gap-6 pt-4">
          <BeatHeading beat={2} />
          <ItemView item={chapter.photograph} />
          <p className="measure"><SlotText value={chapter.photographContext} /></p>
        </div>
        <div aria-hidden data-place-figures className="pointer-events-none relative hidden select-none overflow-hidden lg:block">
          <p
            data-depth="far"
            className="absolute right-0 top-[6%] font-title text-[7.5rem] font-light leading-none tracking-[-0.04em] text-paper/[0.07] tabular-nums [writing-mode:vertical-rl]"
          >
            {chapter.historicalYear}
          </p>
          <p data-depth="near" className="caps soft absolute left-1 top-[28%] [--caps-track:0.4em] [writing-mode:vertical-rl]">
            {chapter.place}
          </p>
        </div>
      </PlacePhotographMotion>
    </section>
  );
}
