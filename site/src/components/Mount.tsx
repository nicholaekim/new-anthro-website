import Image from "next/image";
import { isSlot, type Text } from "@/content/slot";
import type { ImageRef } from "@/content/types";
import { SlotText } from "./SlotText";

// The frame every item sits in: a mat with a thin keyline around the image. Without an image it
// is an empty mount holding the gap note, or "No image" when there is none; never a stand-in picture.
// eager: load the image at once, for a frame that is hidden until a control reveals it (a lazy
// image is not fetched while it cannot be seen).
export function Mount({
  image,
  alt,
  gapNote = null,
  eager = false,
}: {
  image: ImageRef | null;
  alt: Text;
  gapNote?: Text | null;
  eager?: boolean;
}) {
  if (image) {
    return (
      <div data-mount className="mat">
        <Image
          src={image.src}
          width={image.width}
          height={image.height}
          loading={eager ? "eager" : undefined}
          alt={isSlot(alt) ? `[${alt.slot}]` : alt}
          className="outline outline-1 outline-ink/25"
        />
      </div>
    );
  }
  return (
    <div
      data-mount
      data-empty-mount
      className="flex min-h-48 items-center justify-center soft border border-dashed border-current/45 px-6 py-8 text-center font-interface text-sm"
    >
      <span className="max-w-[40ch]">{gapNote === null ? "No image" : <SlotText value={gapNote} />}</span>
    </div>
  );
}
