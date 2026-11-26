import { Fragment } from "react";
import type { Era, Item } from "@/content/types";
import { ChangeOfDateMotion } from "@/motion/ChangeOfDateMotion";
import { Mount } from "../Mount";
import { SlotText } from "../SlotText";

// Each era is a media layer and a caption, one after the other; this is also the still version.
// The media layer is the image, or a plain empty panel whose large year is decoration only.
// The caption is ordinary text: the year, and for an item without an image its gap note or
// "No image". ChangeOfDateMotion only ever fades the media layers, never a caption.
// The item's text is shown in beats 3 and 7, so only this appears here.
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
  const eras: [Era, Item, number][] = [
    ["historical", historical, historicalYear],
    ["present", present, presentYear],
  ];
  return (
    <ChangeOfDateMotion
      presentYear={presentYear}
      intro={
        <>
          <h2 id="beat-6-heading" className="font-title text-2xl">Change of date</h2>
          <div aria-hidden data-date-line className="h-0.5 w-full bg-interface" />
        </>
      }
    >
      <div data-stage className="flex flex-col gap-4">
        {eras.map(([era, item, year]) => (
          <Fragment key={era}>
            <div data-media={era} data-era={era} aria-hidden={item.image ? undefined : true} className="bg-paper p-4 text-ink">
              {item.image ? (
                <Mount image={item.image} alt={item.alt} />
              ) : (
                <div className="flex min-h-40 items-center justify-center border border-dashed border-ink/40 font-title text-6xl">
                  {year}
                </div>
              )}
            </div>
            <p data-caption={era} className="flex flex-col font-interface text-sm">
              <span className="font-semibold">{year}</span>
              {!item.image && <span>{item.gapNote !== null ? <SlotText value={item.gapNote} /> : "No image"}</span>}
            </p>
          </Fragment>
        ))}
      </div>
    </ChangeOfDateMotion>
  );
}
