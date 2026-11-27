import type { Chapter, PersonCard } from "@/content/types";
import { PersonCardPanel } from "./PersonCardPanel";
import { PersonCardView } from "./PersonCardView";

// The chapter page's backdrop. At the breakpoint (lg, 1024px): a fixed surface with one soft
// pool of light behind the sections, and the person card fixed in its reserved column (see
// [data-person-card] in globals.css). Below it there is no backdrop, and the person card is a
// bottom sheet opened by a fixed button (PersonCardPanel), which works without scripts. One card
// in the page, so its ids stay unique. With person null (a chapter that shows no card) only the
// surface is drawn, across the whole width.
export function Backdrop({ person, chapter }: { person: PersonCard | null; chapter: Chapter }) {
  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 hidden bg-surround lg:block">
        <div
          className={`absolute inset-y-0 right-0 bg-[radial-gradient(ellipse_at_50%_40%,color-mix(in_srgb,var(--color-paper)_7%,transparent),transparent_60%)] ${person ? "left-72" : "left-0"}`}
        />
      </div>
      {person && (
        <PersonCardPanel
          uses={{
            basis: chapter.basis && { cardFactsUsed: chapter.basis.cardFactsUsed },
            present: { basis: chapter.present.basis && { cardFactsUsed: chapter.present.basis.cardFactsUsed } },
          }}
        >
          <PersonCardView person={person} chapter={chapter} />
        </PersonCardPanel>
      )}
    </>
  );
}
