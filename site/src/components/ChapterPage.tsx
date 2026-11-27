import type { Chapter, PersonCard } from "@/content/types";
import { Backdrop } from "./Backdrop";
import { BeatTicks } from "./BeatTicks";
import { PlaceDateTag } from "./PlaceDateTag";
import { StartAtTop } from "./StartAtTop";
import { StoryProgressProvider } from "./StoryProgress";
import { BasisBeat } from "./beats/BasisBeat";
import { ChangeOfDate } from "./beats/ChangeOfDate";
import { ChapterCard } from "./beats/ChapterCard";
import { CloseBeat } from "./beats/CloseBeat";
import { ItemsBeat } from "./beats/ItemsBeat";
import { OutcomeBeat } from "./beats/OutcomeBeat";
import { PlacePhotograph } from "./beats/PlacePhotograph";
import { PresentDay } from "./beats/PresentDay";

export function ChapterPage({
  chapter,
  person,
  next,
  position,
}: {
  chapter: Chapter;
  person: PersonCard;
  next: { href: string; label: string };
  // Which chapter this is, for the tag beside the place and date ("Chapter 1 of 4").
  position?: { number: number; count: number };
}) {
  // No person card at all (no column, no button, no facts listed) when the chapter does not show it.
  const card = chapter.showPersonCard ? person : null;
  const historical = chapter.changeOfDate && chapter.items.find((i) => i.id === chapter.changeOfDate?.historicalItemId);
  const instrument = chapter.present.instrument;
  const present = instrument && instrument.id === chapter.changeOfDate?.presentItemId ? instrument : null;
  const beats = [1, 2, 3, chapter.basis && 4, chapter.outcome && 5, historical && present && 6, 7, 8].filter(
    (n): n is number => typeof n === "number",
  );

  return (
    // The bottom padding (7rem) keeps the last content clear of the fixed story bar, one row of
    // 2rem, 3.25rem on touch (BeatTicks).
    <StoryProgressProvider
      slug={chapter.slug}
      beats={beats}
      className={`grid pb-28 ${card ? "lg:grid-cols-[18rem_1fr]" : ""}`}
    >
      <StartAtTop />
      <main className={card ? "lg:col-start-2" : undefined}>
        <ChapterCard chapter={chapter} />
        <PlacePhotograph chapter={chapter} />
        <ItemsBeat items={chapter.items} />
        {chapter.basis && <BasisBeat basis={chapter.basis} person={card} />}
        {chapter.outcome && <OutcomeBeat outcome={chapter.outcome} />}
        {historical && present && (
          <ChangeOfDate
            historical={historical}
            present={present}
            historicalYear={chapter.historicalYear}
            presentYear={chapter.presentYear}
          />
        )}
        <PresentDay chapter={chapter} person={card} />
        <CloseBeat next={next} />
      </main>
      <Backdrop person={card} chapter={chapter} />
      <PlaceDateTag
        place={chapter.place}
        historicalYear={chapter.historicalYear}
        presentYear={chapter.presentYear}
        position={position}
      />
      <BeatTicks beats={beats} />
    </StoryProgressProvider>
  );
}
