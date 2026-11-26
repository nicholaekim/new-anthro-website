import type { Era, Item } from "@/content/types";
import { ChangeOfDateMotion } from "@/motion/ChangeOfDateMotion";
import { Mount } from "../Mount";

// The two mounts one after the other, each labelled by year; this is also the still version.
// The item's text is shown in beats 3 and 7, so only the mounts appear here.
// ChangeOfDateMotion adds the pin, the cross-fade and the era switch.
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
    <ChangeOfDateMotion presentYear={presentYear}>
      <h2 id="beat-6-heading" className="font-title text-2xl">Change of date</h2>
      <div aria-hidden data-date-line className="h-0.5 w-full bg-interface" />
      <div data-stage className="flex flex-col gap-6">
        {mounts.map(([era, item, year]) => (
          <figure key={era} data-era={era} className="flex flex-col gap-2 bg-paper p-4 text-ink">
            <figcaption className="font-interface text-sm">{year}</figcaption>
            <Mount image={item.image} alt={item.alt} />
          </figure>
        ))}
      </div>
    </ChangeOfDateMotion>
  );
}
