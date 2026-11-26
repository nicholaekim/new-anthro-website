import type { Chapter } from "@/content/types";
import { ItemView } from "../ItemView";
import { SlotText } from "../SlotText";

export function PlacePhotograph({ chapter }: { chapter: Chapter }) {
  return (
    <section data-beat="2" id="beat-2" aria-labelledby="beat-2-heading" className="flex flex-col gap-4 bg-surround p-8">
      <h2 id="beat-2-heading" className="font-title text-2xl">Place</h2>
      <ItemView item={chapter.photograph} />
      <p className="font-yours"><SlotText value={chapter.photographContext} /></p>
    </section>
  );
}
