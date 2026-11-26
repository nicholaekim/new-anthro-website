import Image from "next/image";
import { isSlot, type Text } from "@/content/slot";
import type { ImageRef } from "@/content/types";
import { SlotText } from "./SlotText";

// The frame every item sits in. Without an image it is an empty mount holding the gap note,
// or "No image" when there is none; never a stand-in picture.
export function Mount({ image, alt, gapNote = null }: { image: ImageRef | null; alt: Text; gapNote?: Text | null }) {
  if (image) {
    return (
      <div data-mount className="border border-ink/20 p-2">
        <Image src={image.src} width={image.width} height={image.height} alt={isSlot(alt) ? `[${alt.slot}]` : alt} />
      </div>
    );
  }
  return (
    <div data-mount data-empty-mount className="flex min-h-40 items-center justify-center border border-dashed border-ink/40 p-4 font-interface text-sm">
      {gapNote === null ? "No image" : <SlotText value={gapNote} />}
    </div>
  );
}
