import type { Basis, PersonCard } from "@/content/types";
import { Disclosure } from "../Disclosure";
import { SlotText } from "../SlotText";

// Also used for the present-day basis in beat 7.
export function BasisView({ basis, person }: { basis: Basis; person: PersonCard }) {
  const factsUsed = person.facts.filter((f) => basis.cardFactsUsed.includes(f.id));
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
              <li key={f.id}>
                <a href={`#person-${f.id}`} className="target"><SlotText value={f.label} /></a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function BasisBeat({ basis, person }: { basis: Basis; person: PersonCard }) {
  return (
    <section data-beat="4" id="beat-4" aria-labelledby="beat-4-heading" className="flex flex-col gap-4 p-8">
      <h2 id="beat-4-heading" className="font-title text-2xl">Basis</h2>
      <BasisView basis={basis} person={person} />
    </section>
  );
}
