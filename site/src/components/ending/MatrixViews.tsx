"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import type { Era } from "@/content/types";
import { startsBelowView } from "@/motion/entrance";
import { DURATION, gsap, HOUSE_EASE, RISE, STAGGER, useGSAP } from "@/motion/gsap";
import { useMotionMode } from "@/motion/MotionProvider";
import type { MatrixView } from "./matrix";

type Panel = { view: MatrixView; label: string; content: ReactNode };

const EMPHASIS: readonly { value: Era | null; label: string }[] = [
  { value: null, label: "Both" },
  { value: "historical", label: "Then" },
  { value: "present", label: "Now" },
];

// clearProps can leave an empty style attribute behind; remove it.
function tidy(el: HTMLElement) {
  el.removeAttribute("data-entering");
  if (el.getAttribute("style") === "") el.removeAttribute("style");
}

// The matrix's views. Server-rendered (and until scripts run) every view is shown, one after
// another. Once ready, one view at a time: a labelled group of buttons chooses it (aria-pressed),
// the others are hidden, and the change is said once in a polite live region. A second group can
// emphasise one date's column. In full motion, the shown view's rows rise in, in turn, once, the
// first time the matrix comes into view; only if they start below the view, finished at once if
// focus reaches one or the view is changed, and leaving no inline style. Still: nothing moves.
export function MatrixViews({ panels }: { panels: Panel[] }) {
  const { mode, ready } = useMotionMode();
  const [view, setView] = useState(panels[0].view);
  const [emphasis, setEmphasis] = useState<Era | null>(null);
  const [message, setMessage] = useState("");
  const root = useRef<HTMLDivElement>(null);
  const played = useRef(false);
  const entrance = useRef<gsap.core.Tween | null>(null);
  const id = useId();

  useGSAP(
    (context) => {
      const el = root.current;
      if (mode !== "full" || !ready || !el || played.current) return;
      // Set up again when the width crosses 768px, where the rows change layout (table or cards):
      // the old set-up is reverted, leaving nothing inline, and the new one finds the rows shown.
      // Copies the other set-ups' pattern: made outside useGSAP's context (ignore), reverted once.
      const mm = gsap.matchMedia(el);
      context.ignore(() =>
        mm.add({ wide: "(min-width: 768px)", narrow: "(max-width: 767.98px)" }, () => {
          if (played.current) return;
          // The rows of the view shown, in the layout the width gives.
          const rows = [...el.querySelectorAll<HTMLElement>("[data-view]:not([hidden]) [data-matrix-row]")].filter(
            (r) => r.getClientRects().length > 0,
          );
          if (rows.length === 0 || !startsBelowView(rows[0].getBoundingClientRect().top, window.innerHeight)) {
            played.current = true;
            return;
          }
          rows.forEach((r) => r.setAttribute("data-entering", ""));
          const done = () => {
            played.current = true;
            entrance.current = null;
            rows.forEach(tidy);
          };
          entrance.current = gsap.from(rows, {
            opacity: 0,
            y: RISE,
            duration: DURATION.enter,
            stagger: STAGGER,
            ease: HOUSE_EASE,
            clearProps: "opacity,transform",
            scrollTrigger: { trigger: rows[0], start: "top 90%", once: true },
            onComplete: done,
          });
          const onFocusIn = () => entrance.current?.progress(1);
          el.addEventListener("focusin", onFocusIn);
          return () => {
            el.removeEventListener("focusin", onFocusIn);
            entrance.current = null;
            rows.forEach(tidy);
          };
        }),
      );
    },
    { scope: root, dependencies: [mode, ready], revertOnUpdate: true },
  );

  function choose(next: Panel) {
    entrance.current?.progress(1);
    played.current = true;
    if (next.view === view) return;
    setView(next.view);
    setMessage(`Showing: ${next.label}.`);
  }

  return (
    <div ref={root} data-matrix data-emphasis={emphasis ?? undefined} className="leaf flex flex-col gap-8 bg-sheet p-4 sm:p-6">
      {ready && (
        <div className="flex flex-wrap gap-x-10 gap-y-4 font-interface text-sm">
          <ChoiceGroup id={`${id}-show`} label="Show">
            {panels.map((p) => (
              <button key={p.view} type="button" aria-pressed={p.view === view} onClick={() => choose(p)} className="target quiet px-2 hover:text-interface-deep">
                {p.label}
              </button>
            ))}
          </ChoiceGroup>
          <ChoiceGroup id={`${id}-emphasis`} label="Emphasise">
            {EMPHASIS.map((e) => (
              <button
                key={e.label}
                type="button"
                aria-pressed={e.value === emphasis}
                onClick={() => setEmphasis(e.value)}
                className="target quiet px-2 hover:text-interface-deep"
              >
                {e.label}
              </button>
            ))}
          </ChoiceGroup>
        </div>
      )}
      {ready && (
        <p role="status" aria-live="polite" className="sr-only">
          {message}
        </p>
      )}
      {panels.map((p) => (
        <section key={p.view} data-view={p.view} aria-labelledby={`${id}-${p.view}`} hidden={ready && p.view !== view} className="flex flex-col gap-5">
          <h3 id={`${id}-${p.view}`} className="font-title text-xl">{p.label}</h3>
          {p.content}
        </section>
      ))}
    </div>
  );
}

function ChoiceGroup({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <div role="group" aria-labelledby={id} className="flex flex-wrap items-center gap-x-2 gap-y-1">
      <span id={id} className="caps soft mr-1">{label}</span>
      {children}
    </div>
  );
}
