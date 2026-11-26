"use client";

import { useEffect, useRef, useState } from "react";
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
        onClick={() => setOpen(true)}
        className="target self-start px-2 font-interface text-sm underline"
      >
        Open close view
      </button>
      <dialog
        ref={dialogRef}
        data-close-view
        aria-labelledby={headingId}
        onClose={handleClose}
        className="m-auto h-full max-h-none w-full max-w-none bg-paper p-4 text-ink backdrop:bg-surround/80 sm:h-auto sm:max-h-[90svh] sm:max-w-5xl"
      >
        {open && (
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <h2 id={headingId} className="font-title text-xl">
                Close view: <SlotText value={item.provenance.title} />
              </h2>
              <button
                ref={closeRef}
                type="button"
                onClick={() => dialogRef.current?.close()}
                className="target shrink-0 px-2 font-interface text-sm underline"
              >
                Close
              </button>
            </div>
            <div className="flex flex-col gap-4 md:flex-row">
              {item.transcription !== null && (
                <div className="md:order-2 md:w-1/2">
                  <h3 className="font-interface text-xs">Transcription</h3>
                  <p className="font-source whitespace-pre-line"><SlotText value={item.transcription} /></p>
                </div>
              )}
              <div className="flex flex-col gap-2 md:order-1 md:flex-1">
                <Mount image={item.image && { ...item.image, src: large ?? item.image.src }} alt={item.alt}>
                  {item.gapNote !== null && <SlotText value={item.gapNote} />}
                </Mount>
                {large && (
                  <a href={large} className="target self-start font-interface text-sm underline">
                    Large image
                  </a>
                )}
              </div>
            </div>
            {item.annotations.length > 0 && (
              <div>
                <h3 className="font-interface text-xs">Annotations</h3>
                <ol className="list-decimal pl-5 font-yours">
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
