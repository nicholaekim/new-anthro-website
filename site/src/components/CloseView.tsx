"use client";

import { useEffect, useRef, useState } from "react";
import { isSlot } from "@/content/slot";
import type { Item } from "@/content/types";
import { Mount } from "./Mount";
import { SlotText } from "./SlotText";

// A modal native dialog. Its contents (and so the large image) render only while it is open.
// The dialog's own Escape handling closes it; either way focus returns to the opener.
export function CloseView({ item }: { item: Item }) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const headingId = `${item.id}-close-view-heading`;
  const large = item.image?.largeSrc;
  const title = item.provenance.title;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;
    if (!dialog.open) dialog.showModal();
    closeRef.current?.focus();
  }, [open]);

  function handleClose() {
    setOpen(false);
    openerRef.current?.focus();
  }

  return (
    <>
      <button
        ref={openerRef}
        type="button"
        data-close-view-open
        aria-haspopup="dialog"
        aria-label={`Open close view: ${isSlot(title) ? `[${title.slot}]` : title}`}
        onClick={() => setOpen(true)}
        className="target quiet self-start px-2 text-sm"
      >
        Open close view
      </button>
      <dialog
        ref={dialogRef}
        data-close-view
        aria-labelledby={headingId}
        onClose={handleClose}
        className="leaf m-auto h-full max-h-none w-full max-w-none bg-paper p-5 backdrop:bg-surround/85 sm:h-auto sm:max-h-[90svh] sm:max-w-5xl sm:p-8"
      >
        {open && (
          <div className="flex flex-col gap-6">
            <div className="flex items-start justify-between gap-4 border-b border-(--hair) pb-4">
              <h2 id={headingId} className="font-title type-heading">
                Close view: <SlotText value={item.provenance.title} />
              </h2>
              <button
                ref={closeRef}
                type="button"
                onClick={() => dialogRef.current?.close()}
                className="target quiet shrink-0 px-2 text-sm"
              >
                Close
              </button>
            </div>
            <div className="flex flex-col gap-6 md:flex-row">
              {item.transcription !== null && (
                <div className="md:order-2 md:w-1/2">
                  <h3 className="caps soft mb-1">Transcription</h3>
                  <p className="font-source type-source whitespace-pre-line border-l-2 border-ink/25 bg-paper-deep px-4 py-3">
                    <SlotText value={item.transcription} />
                  </p>
                </div>
              )}
              <div className="flex flex-col gap-2 md:order-1 md:flex-1">
                <Mount image={item.image && { ...item.image, src: large ?? item.image.src }} alt={item.alt} gapNote={item.gapNote} />
                {large && (
                  <a href={large} className="target quiet -mx-2 self-start px-2 text-sm">
                    Large image
                  </a>
                )}
              </div>
            </div>
            {item.annotations.length > 0 && (
              <div>
                <h3 className="caps soft mb-1">Annotations</h3>
                <ol className="measure flex list-decimal flex-col gap-2 pl-7 font-yours marker:font-interface marker:text-sm marker:text-ink-soft">
                  {item.annotations.map((a) => (
                    <li key={a.id}><SlotText value={a.text} /></li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        )}
      </dialog>
    </>
  );
}
