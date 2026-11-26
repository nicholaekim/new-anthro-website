import type { Era, Item } from "@/content/types";
import { Mount } from "../Mount";

// Still version: the two mounts one after the other, each labelled by year.
// The item's text is shown in beats 3 and 7, so only the mounts appear here.
export function ChangeOfDate({
  historical,
  present,
  historicalYear,
  presentYear,
}: {
  historical: Item;
  present: Item;
  historicalYear: number;
  presentYear: number;
}) {
  const mounts: [Era, Item, number][] = [
    ["historical", historical, historicalYear],
    ["present", present, presentYear],
  ];
  return (
    <section data-beat="6" id="beat-6" aria-labelledby="beat-6-heading" className="flex flex-col gap-6 p-8">
      <h2 id="beat-6-heading" className="font-title text-2xl">Change of date</h2>
      {mounts.map(([era, item, year]) => (
        <figure key={era} data-era={era} className="flex flex-col gap-2 bg-paper p-4 text-ink">
          <figcaption className="font-interface text-sm">{year}</figcaption>
          <Mount image={item.image} alt={item.alt} />
        </figure>
      ))}
    </section>
  );
}
