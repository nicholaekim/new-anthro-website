import type { Basis, PersonCard } from "@/content/types";
import { Disclosure } from "../Disclosure";
import { SlotText } from "../SlotText";

// Also used for the present-day basis in beat 7. person is null when the chapter shows no
// person card; then no facts are listed. The labels are plain text: the card is a closed
// popover below the breakpoint, so a link to it would go nowhere.
export function BasisView({ basis, person }: { basis: Basis; person: PersonCard | null }) {
  const factsUsed = person?.facts.filter((f) => basis.cardFactsUsed.includes(f.id)) ?? [];
  return (
    <div className="flex flex-col gap-3">
      <blockquote className="font-source"><SlotText value={basis.quote} /></blockquote>
      <Disclosure summary="Citation">
        <SlotText value={basis.citation} />
      </Disclosure>
      <p className="font-yours"><SlotText value={basis.explanation} /></p>
      {factsUsed.length > 0 && (
        <div className="font-interface text-sm">
          <p>Person-card facts used:</p>
          <ul className="list-disc pl-5">
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
    <section data-beat="4" id="beat-4" aria-labelledby="beat-4-heading" className="flex flex-col gap-4 p-8">
      <h2 id="beat-4-heading" className="font-title text-2xl">Basis</h2>
      <BasisView basis={basis} person={person} />
    </section>
  );
}
