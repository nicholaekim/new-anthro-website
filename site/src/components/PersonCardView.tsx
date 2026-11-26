import type { PersonCard } from "@/content/types";
import { SlotText } from "./SlotText";

// Static. Facts the chapter's sources show were used carry data-used.
export function PersonCardView({ person, used }: { person: PersonCard; used: readonly string[] }) {
  return (
    <aside aria-labelledby="person-card-heading" className="bg-paper p-4 font-interface text-sm text-ink">
      <h2 id="person-card-heading" className="font-title text-lg">Person card</h2>
      <p className="mt-2"><SlotText value={person.fictionStatement} /></p>
      <dl className="mt-3 flex flex-col gap-3">
        {person.facts.map((fact) => (
          <div
            key={fact.id}
            id={`person-${fact.id}`}
            data-used={used.includes(fact.id) ? "" : undefined}
            className="data-used:outline-2 data-used:outline-interface"
          >
            <dt className="font-semibold"><SlotText value={fact.label} /></dt>
            <dd><SlotText value={fact.value} /></dd>
            <dd className="text-xs">Reason: <SlotText value={fact.reason} /></dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
