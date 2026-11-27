"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import type { Highlight } from "@/content/regions";
import { isSlot } from "@/content/slot";
import type { Item } from "@/content/types";
import { useMotionMode } from "@/motion/MotionProvider";
import { Transcription } from "../Bilingual";
import { Disclosure } from "../Disclosure";
import { Mount } from "../Mount";
import { ProvenanceList } from "../ProvenanceList";
import { SlotText } from "../SlotText";
import { HighlightList } from "./HighlightList";
import { ViewerStage, type ZoomRequest } from "./ViewerStage";

const PANEL_HEADING = "caps soft mb-2";

const joinNumbers = (ns: number[]) =>
  ns.length < 2 ? ns.join("") : `${ns.slice(0, -1).join(", ")} and ${ns[ns.length - 1]}`;

// What a screen reader hears when a highlight is chosen.
function choiceMessage(h: Highlight, item: Item): string {
  const numbers = h.annotationIds.map((id) => item.annotations.findIndex((a) => a.id === id) + 1).filter((n) => n > 0);
  if (numbers.length === 0) return `Showing ${h.label}.`;
  return `Showing ${h.label}. ${numbers.length === 1 ? "Annotation" : "Annotations"} ${joinNumbers(numbers)} marked.`;
}

// The close view's contents: the zoomable page with its highlights, and beside it (below it on
// narrower screens) the transcription, the annotations and the source information. Choosing a
// highlight, on the page or by name, zooms to it and marks the annotations that discuss it;
// choosing an annotation's "Show on page" does the same from the other side.
export function DocumentViewer({
  item,
  highlights,
  initialId,
  headingId,
  closeRef,
  onCloseClick,
}: {
  item: Item;
  highlights: Highlight[];
  initialId: string | null;
  headingId: string;
  closeRef: RefObject<HTMLButtonElement | null>;
  onCloseClick: () => void;
}) {
  const { mode } = useMotionMode();
  const image = item.image;
  const initial = highlights.find((h) => h.id === initialId) ?? null;
  const [selectedId, setSelectedId] = useState<string | null>(initial?.id ?? null);
  const [request, setRequest] = useState<ZoomRequest | null>(initial ? { id: initial.id, seq: 1 } : null);
  const [showOutlines, setShowOutlines] = useState(true);
  // Empty at first: a live region announces a change, not what it held when it appeared.
  const [message, setMessage] = useState("");
  const seq = useRef(1);
  const panelRef = useRef<HTMLDivElement>(null);

  const selected = highlights.find((h) => h.id === selectedId) ?? null;
  const marked = new Set(selected?.annotationIds ?? []);

  // Bring an annotation into view inside the panel, where the panel scrolls on its own (side by
  // side with the page). Stacked, the panel is part of the dialog's scroll and is left alone,
  // so the page being zoomed stays in view.
  const scrollPanelTo = (annotationId: string) => {
    const panel = panelRef.current;
    const el = panel?.querySelector(`[data-annotation="${annotationId}"]`);
    if (!panel || !el || panel.scrollHeight <= panel.clientHeight) return;
    const box = panel.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    if (r.top >= box.top && r.bottom <= box.bottom) return;
    panel.scrollTo({ top: panel.scrollTop + r.top - box.top - 16, behavior: mode === "full" ? "smooth" : "auto" });
  };

  const choose = (id: string, from: "page" | "annotation") => {
    const h = highlights.find((x) => x.id === id);
    if (!h) return;
    seq.current += 1;
    setSelectedId(id);
    setRequest({ id, seq: seq.current });
    setMessage(choiceMessage(h, item));
    if (from === "page" && h.annotationIds.length > 0) scrollPanelTo(h.annotationIds[0]);
  };

  // Opened at a highlight from the page: its annotations are brought into view as if chosen here.
  const initialAnnotation = initial?.annotationIds[0];
  useEffect(() => {
    if (initialAnnotation) scrollPanelTo(initialAnnotation);
    // Said a moment after the dialog opens, once the live region is there to announce it.
    if (!initial) return;
    const timer = setTimeout(() => setMessage(choiceMessage(initial, item)), 100);
    return () => clearTimeout(timer);
    // Once, on opening.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const highlightsFor = (annotationId: string) => highlights.filter((h) => h.annotationIds.includes(annotationId));

  return (
    <div className="flex flex-col gap-4 lg:h-full lg:min-h-0">
      <div className="flex items-start justify-between gap-4 border-b border-(--hair) pb-3">
        <h2 id={headingId} className="font-title text-lg leading-snug sm:text-xl lg:text-2xl">
          Close view: <SlotText value={item.provenance.title} />
        </h2>
        <button ref={closeRef} type="button" onClick={onCloseClick} className="target quiet shrink-0 px-2 text-sm">
          Close
        </button>
      </div>
      <div className="flex flex-col gap-6 lg:min-h-0 lg:flex-1 lg:flex-row">
        <div className="flex flex-col gap-3 lg:min-h-0 lg:min-w-0 lg:flex-1">
          {image ? (
            <div className="flex h-[min(72svh,44rem)] flex-col lg:h-auto lg:min-h-0 lg:flex-1">
              <ViewerStage
                image={image}
                src={image.src}
                alt={isSlot(item.alt) ? `[${item.alt.slot}]` : item.alt}
                highlights={highlights}
                selectedId={selectedId}
                request={request}
                showOutlines={showOutlines}
                onChoose={(id) => choose(id, "page")}
              />
            </div>
          ) : (
            <Mount image={null} alt={item.alt} gapNote={item.gapNote} />
          )}
          {image && highlights.length > 0 && (
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center justify-between gap-x-4">
                <p id={`${headingId}-highlights`} className="caps soft">
                  Highlights
                </p>
                <button
                  type="button"
                  aria-pressed={showOutlines}
                  onClick={() => setShowOutlines((v) => !v)}
                  className="target quiet -mr-2 px-2 text-sm"
                >
                  Show highlights
                </button>
              </div>
              <HighlightList
                labelledBy={`${headingId}-highlights`}
                highlights={highlights}
                selectedId={selectedId}
                onChoose={(id) => choose(id, "page")}
              />
            </div>
          )}
        </div>
        <div
          ref={panelRef}
          data-viewer-panel
          className="flex flex-col gap-6 lg:w-[min(28rem,42%)] lg:shrink-0 lg:overflow-y-auto lg:overscroll-contain lg:pr-2"
        >
          {item.transcription !== null && (
            <div>
              <h3 className={PANEL_HEADING}>Transcription</h3>
              <Transcription text={item.transcription} translation={item.translation} lang={item.originalLang} />
            </div>
          )}
          {item.annotations.length > 0 && (
            <div>
              <h3 className={PANEL_HEADING}>Annotations</h3>
              <ol className="flex list-decimal flex-col gap-3 pl-7 font-yours marker:font-interface marker:text-sm marker:text-ink-soft">
                {item.annotations.map((a) => {
                  const isMarked = marked.has(a.id);
                  return (
                    <li
                      key={a.id}
                      data-annotation={a.id}
                      aria-current={isMarked ? "true" : undefined}
                      className="viewer-annotation pl-2"
                    >
                      {isMarked && <span className="caps soft block">About the chosen highlight</span>}
                      <SlotText value={a.text} />
                      {image &&
                        highlightsFor(a.id).map((h) => (
                          <button
                            key={h.id}
                            type="button"
                            onClick={() => choose(h.id, "annotation")}
                            className="target quiet -ml-2 block px-2 text-sm"
                          >
                            Show on page: {h.label}
                          </button>
                        ))}
                    </li>
                  );
                })}
              </ol>
            </div>
          )}
          <Disclosure summary="Source information">
            <ProvenanceList provenance={item.provenance} />
          </Disclosure>
        </div>
      </div>
      <p aria-live="polite" className="sr-only">
        {message}
      </p>
    </div>
  );
}
