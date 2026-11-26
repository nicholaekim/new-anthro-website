import type { Chapter } from "@/content/types";
import { SlotText } from "../SlotText";

export function ChapterCard({ chapter }: { chapter: Chapter }) {
  return (
    <section data-beat="1" id="beat-1" aria-labelledby="beat-1-heading" className="flex min-h-svh flex-col justify-center gap-6 bg-surround p-8 text-paper">
      <h1 id="beat-1-heading" className="font-title text-5xl">
        {chapter.place}, {chapter.country}
        <span className="mt-2 block text-3xl">{chapter.historicalYear}</span>
      </h1>
      <p className="font-interface text-sm">
        Content note: <SlotText value={chapter.contentNote} />
      </p>
    </section>
  );
}
