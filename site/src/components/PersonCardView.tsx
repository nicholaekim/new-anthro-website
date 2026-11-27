import type { PersonCard } from "@/content/types";
import { SlotText } from "./SlotText";

// Static. Facts the chapter's sources show were used carry data-used: a solid bar at the left
// edge and a stronger label. An index card: thin rules between the facts.
export function PersonCardView({ person, used }: { person: PersonCard; used: readonly string[] }) {
  return (
    <aside aria-labelledby="person-card-heading" className="leaf bg-paper p-5 font-interface text-sm">
      <h2 id="person-card-heading" className="border-b border-(--hair) pb-3 font-title text-xl">Person card</h2>
      <p className="soft mt-3 text-[0.8125rem] leading-relaxed"><SlotText value={person.fictionStatement} /></p>
      <dl className="mt-3 flex flex-col divide-y divide-(--hair) border-t border-(--hair)">
        {person.facts.map((fact) => (
          <div
            key={fact.id}
            id={`person-${fact.id}`}
            data-used={used.includes(fact.id) ? "" : undefined}
            className="group border-l-2 border-l-transparent py-3 pl-3 data-used:border-l-ink"
          >
            <dt className="caps soft group-data-used:font-semibold group-data-used:text-ink"><SlotText value={fact.label} /></dt>
            <dd className="mt-0.5 text-ink"><SlotText value={fact.value} /></dd>
            <dd className="soft mt-1 text-xs leading-relaxed">Reason: <SlotText value={fact.reason} /></dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
