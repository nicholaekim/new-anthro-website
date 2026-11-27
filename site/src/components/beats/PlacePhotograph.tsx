import type { Chapter } from "@/content/types";
import { PlacePhotographMotion } from "@/motion/PlacePhotographMotion";
import { BeatHeading } from "../BeatHeading";
import { ItemView } from "../ItemView";
import { SlotText } from "../SlotText";

// The decorative layers are placeholders for the student's own foreground shapes. They sit in
// their own column at the breakpoint, so they never cover the photograph or any text.
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
        <div aria-hidden className="relative hidden overflow-hidden lg:block">
          <div data-layer="1" className="absolute inset-x-6 top-[15%] h-1/4 bg-sheet/10" />
          <div data-layer="2" className="absolute inset-x-2 top-[45%] h-1/3 bg-paper/10" />
          <div data-layer="3" className="absolute inset-x-10 top-[70%] h-1/2 bg-interface/30" />
        </div>
      </PlacePhotographMotion>
    </section>
  );
}
