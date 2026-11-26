import type { Chapter, PersonCard } from "@/content/types";
import { Backdrop } from "./Backdrop";
import { BeatTicks } from "./BeatTicks";
import { PlaceDateTag } from "./PlaceDateTag";
import { StartAtTop } from "./StartAtTop";
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
}: {
  chapter: Chapter;
  person: PersonCard;
  next: { href: string; label: string };
}) {
  const historical = chapter.changeOfDate && chapter.items.find((i) => i.id === chapter.changeOfDate?.historicalItemId);
  const instrument = chapter.present.instrument;
  const present = instrument && instrument.id === chapter.changeOfDate?.presentItemId ? instrument : null;
  const used = [...(chapter.basis?.cardFactsUsed ?? []), ...(chapter.present.basis?.cardFactsUsed ?? [])];
  const beats = [1, 2, 3, chapter.basis && 4, chapter.outcome && 5, historical && present && 6, 7, 8].filter(
    (n): n is number => typeof n === "number",
  );

  return (
    <div data-chapter={chapter.slug} className="grid pb-28 lg:grid-cols-[18rem_1fr]">
      <StartAtTop />
      <main className="lg:col-start-2">
        <ChapterCard chapter={chapter} />
        <PlacePhotograph chapter={chapter} />
        <ItemsBeat items={chapter.items} />
        {chapter.basis && <BasisBeat basis={chapter.basis} person={person} />}
        {chapter.outcome && <OutcomeBeat outcome={chapter.outcome} />}
        {historical && present && (
          <ChangeOfDate
            historical={historical}
            present={present}
            historicalYear={chapter.historicalYear}
            presentYear={chapter.presentYear}
          />
        )}
        <PresentDay chapter={chapter} person={person} />
        <CloseBeat next={next} />
      </main>
      <Backdrop person={person} used={used} />
      <PlaceDateTag place={chapter.place} historicalYear={chapter.historicalYear} presentYear={chapter.presentYear} />
      <BeatTicks beats={beats} />
    </div>
  );
}
