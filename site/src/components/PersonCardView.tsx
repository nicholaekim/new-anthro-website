import type { Chapter, PersonCard } from "@/content/types";
import { CardEmphasis } from "./CardEmphasis";
import { ConfidenceMeter } from "./ConfidenceMeter";
import { SlotText } from "./SlotText";
import { CONFIDENCE_WORDS, factMarks } from "./story";

// An index card: thin rules between the facts. With a chapter, each fact says whether each era's
// rule uses it (a filled or hollow square and the words), with a link to the section quoting a
// rule that does; the facts the rule in view uses are emphasised (CardEmphasis); and a footer
// gives each outcome's confidence. Without a chapter (the opening page) it shows the facts only.
export function PersonCardView({ person, chapter = null }: { person: PersonCard; chapter?: Chapter | null }) {
  const facts = (
    <dl className="mt-3 flex flex-col divide-y divide-(--hair) border-t border-(--hair)">
      {person.facts.map((fact) => {
        const marks = chapter ? factMarks(chapter, fact.id) : [];
        const uses = (era: string) => (marks.some((m) => m.era === era && m.used) ? "" : undefined);
        return (
          <div
            key={fact.id}
            id={`person-${fact.id}`}
            data-fact={fact.id}
            data-uses-historical={uses("historical")}
            data-uses-present={uses("present")}
            className="relative py-3 pl-3"
          >
            <span aria-hidden data-fact-bar className="absolute inset-y-0 left-0 w-0.5 bg-ink" />
            <dt data-fact-label className="caps soft"><SlotText value={fact.label} /></dt>
            <dd className="mt-0.5 text-ink"><SlotText value={fact.value} /></dd>
            <dd className="soft mt-1 text-xs leading-relaxed">Reason: <SlotText value={fact.reason} /></dd>
            {marks.length > 0 && (
              <dd className="mt-2">
                <ul className="flex flex-col text-xs">
                  {marks.map((m) => (
                    <li key={m.era} data-era-mark={m.era} className="flex flex-wrap items-center gap-x-2">
                      <span aria-hidden className={`block size-2 shrink-0 ${m.used ? "bg-ink" : "border border-ink-soft"}`} />
                      <span className={m.used ? "text-ink" : "soft"}>{m.label}</span>
                      {m.used && (
                        <a href={`#beat-${m.beat}`} className="target quiet text-ink hover:text-interface-deep">
                          <span aria-hidden>See the rule</span>
                          <span className="sr-only">{`See the rule (${m.year})`}</span>
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </dd>
            )}
          </div>
        );
      })}
    </dl>
  );

  const outcomes = chapter
    ? ([
        [chapter.historicalYear, chapter.outcome, 5],
        [chapter.presentYear, chapter.present.outcome, 7],
      ] as const)
    : [];
  const rated = outcomes.flatMap(([year, outcome, beat]) => (outcome ? [{ year, level: outcome.level, beat }] : []));

  return (
    <aside aria-labelledby="person-card-heading" className="leaf bg-paper p-5 font-interface text-sm">
      <h2 id="person-card-heading" className="border-b border-(--hair) pb-3 font-title text-xl">Person card</h2>
      <p className="soft mt-3 text-[0.8125rem] leading-relaxed"><SlotText value={person.fictionStatement} /></p>
      {chapter ? <CardEmphasis>{facts}</CardEmphasis> : facts}
      {rated.length > 0 && (
        <section aria-labelledby="person-card-chapter" className="mt-1 border-t border-(--hair) pt-3">
          <h3 id="person-card-chapter" className="caps soft">In this chapter</h3>
          <p className="soft mt-1 text-xs">Outcome confidence</p>
          <ul className="mt-1 flex flex-col">
            {rated.map((r) => (
              <li key={r.year}>
                <a href={`#beat-${r.beat}`} className="target quiet gap-2 text-ink hover:text-interface-deep">
                  <span className="sr-only">{`${r.year} outcome, confidence: ${CONFIDENCE_WORDS[r.level]}`}</span>
                  <span aria-hidden className="tabular-nums">{r.year}</span>
                  <ConfidenceMeter level={r.level} />
                  <span aria-hidden>{CONFIDENCE_WORDS[r.level]}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </aside>
  );
}
