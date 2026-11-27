import type { PersonCard } from "@/content/types";
import { PersonCardView } from "./PersonCardView";

// The chapter page's backdrop. At the breakpoint (lg, 1024px): a fixed surface with one soft
// pool of light behind the sections, and the person card fixed in its reserved column (see
// [data-person-card] in globals.css). Below it there is no backdrop, and the person card is a
// native popover opened by a fixed button, which works without scripts. One card in the page,
// so its ids stay unique. With person null (a chapter that shows no card) only the surface is
// drawn, across the whole width.
export function Backdrop({ person, used }: { person: PersonCard | null; used: readonly string[] }) {
  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 hidden bg-surround lg:block">
        <div
          className={`absolute inset-y-0 right-0 bg-[radial-gradient(ellipse_at_50%_40%,color-mix(in_srgb,var(--color-paper)_7%,transparent),transparent_60%)] ${person ? "left-72" : "left-0"}`}
        />
      </div>
      {person && <PersonCardPanel person={person} used={used} />}
    </>
  );
}

function PersonCardPanel({ person, used }: { person: PersonCard; used: readonly string[] }) {
  return (
    <>
      <button
        type="button"
        popoverTarget="person-card-panel"
        className="target quiet fixed left-2 top-11 z-20 bg-raised px-2 text-xs text-paper hover:text-interface pointer-coarse:top-16 lg:hidden"
      >
        Person card
      </button>
      <div
        id="person-card-panel"
        popover="auto"
        data-person-card
        className="m-auto max-h-[85vh] w-[min(22rem,calc(100vw-2rem))] overflow-y-auto border border-rule bg-raised p-3 text-paper backdrop:bg-surround/80"
      >
        <PersonCardView person={person} used={used} />
        <button
          type="button"
          popoverTarget="person-card-panel"
          popoverTargetAction="hide"
          className="target quiet mt-3 px-2 text-sm hover:text-interface lg:hidden"
        >
          Close
        </button>
      </div>
    </>
  );
}
