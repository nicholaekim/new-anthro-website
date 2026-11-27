"use client";

import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { highlights as allHighlights, type Highlight } from "@/content/regions";
import { isSlot } from "@/content/slot";
import type { Item } from "@/content/types";
import { DocumentViewer } from "./viewer/DocumentViewer";

// The close view: a modal native dialog holding the document viewer, opened by "Open close view"
// or, under a document image, by the name of one of its highlights, which opens it at that
// highlight. Its contents (and so the full-size image) render only while it is open. The
// dialog's own Escape handling closes it; either way focus returns to the control that opened it.
// children: further controls for the row beside "Open close view" (the "Large image" link).
export function CloseView({
  item,
  highlights = allHighlights[item.id] ?? [],
  children,
}: {
  item: Item;
  highlights?: Highlight[];
  children?: ReactNode;
}) {
  const [open, setOpen] = useState<{ at: string | null } | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const headingId = `${item.id}-close-view-heading`;
  const listId = `${item.id}-highlights-label`;
  const title = item.provenance.title;
  // A highlight is a place on the image: without one there is nothing to point at.
  const pageHighlights = item.image ? highlights : [];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;
    if (!dialog.open) dialog.showModal();
    closeRef.current?.focus();
  }, [open]);

  function openAt(at: string | null, event: MouseEvent<HTMLButtonElement>) {
    openerRef.current = event.currentTarget;
    setOpen({ at });
  }

  function handleClose() {
    setOpen(null);
    openerRef.current?.focus();
  }

  return (
    <div className="flex flex-col gap-3">
      {pageHighlights.length > 0 && (
        <div className="flex flex-col gap-1">
          <p id={listId} className="caps soft">
            Highlights on this page
          </p>
          <ul aria-labelledby={listId} className="-mx-2 flex flex-wrap gap-x-1">
            {pageHighlights.map((h) => (
              <li key={h.id}>
                <button
                  type="button"
                  data-highlight-opener={h.id}
                  aria-haspopup="dialog"
                  onClick={(e) => openAt(h.id, e)}
                  className="target quiet px-2 text-sm"
                >
                  {h.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="-mx-2 flex flex-wrap gap-x-2">
        <button
          type="button"
          data-close-view-open
          aria-haspopup="dialog"
          aria-label={`Open close view: ${isSlot(title) ? `[${title.slot}]` : title}`}
          onClick={(e) => openAt(null, e)}
          className="target quiet px-2 text-sm"
        >
          Open close view
        </button>
        {children}
      </div>
      <dialog
        ref={dialogRef}
        data-close-view
        aria-labelledby={headingId}
        onClose={handleClose}
        className="leaf m-auto h-full max-h-none w-full max-w-none overflow-y-auto overscroll-contain bg-paper p-4 backdrop:bg-surround/85 sm:h-auto sm:max-h-[94svh] sm:w-[calc(100%-2rem)] sm:max-w-6xl sm:p-6 lg:h-[92svh] lg:overflow-hidden"
      >
        {open && (
          <DocumentViewer
            item={item}
            highlights={pageHighlights}
            initialId={open.at}
            headingId={headingId}
            closeRef={closeRef}
            onCloseClick={() => dialogRef.current?.close()}
          />
        )}
      </dialog>
    </div>
  );
}
