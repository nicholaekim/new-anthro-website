import type { Chapter, PersonCard } from "@/content/types";
import { PersonCardView } from "./PersonCardView";
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

  return (
    <div className="grid lg:grid-cols-[18rem_1fr]">
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
      <div className="p-4 lg:col-start-1 lg:row-start-1">
        <div className="lg:sticky lg:top-4">
          <PersonCardView person={person} used={used} />
        </div>
      </div>
    </div>
  );
}
