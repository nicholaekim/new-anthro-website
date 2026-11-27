"use client";

import { useActiveBeat } from "./StoryProgress";

// Shows the historical year until the present-day beat (7) is the active section (StoryProgress),
// so it changes only at that beat boundary. Without scripts it shows the historical year.
// It never takes clicks. Below the breakpoint it sits on its own row under the header, at the
// right (the person card button is at the left of that row), so it covers no control; at the
// breakpoint it sits in the header's row, which has room for it. The chapter's position
// ("Chapter 1 of 4") sits beside it: in the header's row at every width, at its right end (the
// header's controls are at the left), so below the breakpoint the column is that row's height
// (2.5rem, 3.75rem on touch) and a 0.25rem gap, which puts the tag where it was (top-11, top-16).

export function PlaceDateTag({
  place,
  historicalYear,
  presentYear,
  position,
}: {
  place: string;
  historicalYear: number;
  presentYear: number;
  position?: { number: number; count: number };
}) {
  const { activeBeat } = useActiveBeat();
  const present = activeBeat !== null && activeBeat >= 7;
  return (
    <div className="pointer-events-none fixed right-2 top-0 z-30 flex flex-col items-end gap-1 lg:right-4 lg:top-2 lg:flex-row lg:items-center lg:gap-3">
      {position && (
        // Below 360px wide "Chapter" is read but not shown, so the row keeps clear of the header's controls.
        <p data-chapter-position className="caps soft flex h-10 items-center whitespace-nowrap [--caps-track:0.06em] pointer-coarse:h-15 lg:h-auto">
          <span>
            <span className="max-[359.98px]:sr-only">Chapter </span>
            {position.number} of {position.count}
          </span>
        </p>
      )}
      <p
        data-place-date-tag
        data-tag-era={present ? "present" : "historical"}
        // Tighter tracking than other labels and no wrapping: the longest tag stays on one line at 320
        // wide, so it never grows past the top scroll padding.
        className="caps max-w-[calc(100vw-1rem)] whitespace-nowrap border [--caps-track:0.06em] border-rule bg-raised px-2 py-1 text-right text-paper lg:border-0 lg:border-l lg:bg-transparent lg:pl-3 lg:pr-0"
      >
        {place}, {present ? presentYear : historicalYear}
      </p>
    </div>
  );
}
