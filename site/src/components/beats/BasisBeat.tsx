import type { Basis, PersonCard } from "@/content/types";
import { BeatHeading } from "../BeatHeading";
import { Disclosure } from "../Disclosure";
import { SlotText } from "../SlotText";

// Also used for the present-day basis in beat 7. person is null when the chapter shows no
// person card; then no facts are listed. The labels are plain text: the card is a closed
// popover below the breakpoint, so a link to it would go nowhere.
export function BasisView({ basis, person }: { basis: Basis; person: PersonCard | null }) {
  const factsUsed = person?.facts.filter((f) => basis.cardFactsUsed.includes(f.id)) ?? [];
  return (
    <div className="flex flex-col gap-6">
      <blockquote className="measure border-l-2 border-paper/40 pl-5 font-source text-lg leading-[1.6] sm:pl-7 sm:text-xl">
        <SlotText value={basis.quote} />
      </blockquote>
      <Disclosure summary="Citation">
        <span className="soft">
          <SlotText value={basis.citation} />
        </span>
      </Disclosure>
      <p className="measure"><SlotText value={basis.explanation} /></p>
      {factsUsed.length > 0 && (
        <div className="font-interface text-sm">
          <p className="caps soft mb-2">Person-card facts used:</p>
          <ul className="flex list-disc flex-col gap-1 pl-5 marker:text-(--soft)">
            {factsUsed.map((f) => (
              <li key={f.id}><SlotText value={f.label} /></li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function BasisBeat({ basis, person }: { basis: Basis; person: PersonCard | null }) {
  return (
    <section data-beat="4" id="beat-4" aria-labelledby="beat-4-heading" className="beat flex flex-col gap-10">
      <BeatHeading beat={4}>Basis</BeatHeading>
      <BasisView basis={basis} person={person} />
    </section>
  );
}
