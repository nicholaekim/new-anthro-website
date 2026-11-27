"use client";

import type { MouseEvent, ReactNode } from "react";
import { factsUsedAt, type FactUses } from "./story";
import { useActiveBeat } from "./StoryProgress";

// Below the breakpoint: the fixed button that opens the person card, with the number of facts the
// section in view uses, and the card as a bottom sheet (a native popover, so it opens without
// scripts) with its own Close control. A link chosen inside the sheet closes it, so the section
// it goes to is not covered. At the breakpoint globals.css shows the card in its column instead.
export function PersonCardPanel({ uses, children }: { uses: Pick<FactUses, "basis" | "present">; children: ReactNode }) {
  const { activeBeat, eraInView } = useActiveBeat();
  const count = factsUsedAt(uses, activeBeat, eraInView).length;

  function onClick(e: MouseEvent<HTMLDivElement>) {
    const panel = e.currentTarget;
    if (!(e.target as Element).closest("a")) return;
    try {
      if (panel.matches(":popover-open")) panel.hidePopover();
    } catch {
      // a browser without popovers shows the card in place: nothing to close
    }
  }

  return (
    <>
      <button
        type="button"
        popoverTarget="person-card-panel"
        className="target quiet fixed left-2 top-11 z-20 gap-1.5 bg-raised px-2 text-xs text-paper hover:text-interface pointer-coarse:top-16 lg:hidden"
      >
        Person card
        {count > 0 && (
          <>
            <span aria-hidden className="border border-current/60 px-1 tabular-nums">{count}</span>
            <span className="sr-only">{`, ${count === 1 ? "1 fact" : `${count} facts`} used in this section`}</span>
          </>
        )}
      </button>
      <div
        id="person-card-panel"
        popover="auto"
        data-person-card
        onClick={onClick}
        className="inset-x-0 top-auto bottom-0 m-0 max-h-[85svh] w-full max-w-none overflow-y-auto border-0 border-t border-rule bg-raised px-3 pb-4 text-paper backdrop:bg-surround/80"
      >
        <div className="sticky top-0 z-10 -mx-3 mb-1 flex justify-end bg-raised px-3 py-1 lg:hidden">
          <button
            type="button"
            popoverTarget="person-card-panel"
            popoverTargetAction="hide"
            className="target quiet px-2 text-sm hover:text-interface"
          >
            Close
          </button>
        </div>
        <div className="mx-auto max-w-md">{children}</div>
      </div>
    </>
  );
}
