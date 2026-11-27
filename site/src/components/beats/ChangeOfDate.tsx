import { Fragment } from "react";
import type { Era, Item } from "@/content/types";
import { ChangeOfDateMotion } from "@/motion/ChangeOfDateMotion";
import { BeatHeading } from "../BeatHeading";
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
          {/* The date line below the heading is this beat's rule. */}
          <BeatHeading beat={6} rule={false}>Change of date</BeatHeading>
          <div aria-hidden data-date-line className="h-0.5 w-full bg-interface" />
        </>
      }
    >
      <div data-stage className="flex flex-col gap-4">
        {eras.map(([era, item, year]) => (
          <Fragment key={era}>
            <div data-media={era} data-era={era} aria-hidden={item.image ? undefined : true} className="leaf bg-paper p-4">
              {item.image ? (
                <Mount image={item.image} alt={item.alt} />
              ) : (
                // flex-1: in the pin (a column) the empty frame fills the media area.
                <div className="soft flex min-h-40 flex-1 items-center justify-center border border-dashed border-current/45 font-title text-6xl">
                  {year}
                </div>
              )}
            </div>
            <p data-caption={era} className="flex flex-col gap-0.5 font-interface text-sm">
              <span className="caps text-paper">{year}</span>
              {!item.image && <span className="soft">{item.gapNote !== null ? <SlotText value={item.gapNote} /> : "No image"}</span>}
            </p>
          </Fragment>
        ))}
      </div>
    </ChangeOfDateMotion>
  );
}
