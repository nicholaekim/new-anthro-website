import type { Chapter, PersonCard } from "@/content/types";
import { CardEmphasis } from "./CardEmphasis";
import { ConfidenceMeter } from "./ConfidenceMeter";
import { SlotText } from "./SlotText";
import { CONFIDENCE_WORDS, factMarks } from "./story";

// An index card: thin rules between the facts. With a chapter, each fact says whether each era's
// rule uses it (a filled or hollow square and the words), with a link to the section quoting a
// rule that does; the facts the rule in view uses are emphasised (CardEmphasis); and a footer
// gives each outcome's confidence, straight after the fiction statement. In a chapter each fact's
// reason is behind a small disclosure, closed, so the whole card fits a laptop's screen beside the
// sections. Without a chapter (the opening page) it shows the facts only, reasons in view.
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
            className={`relative pl-3 ${chapter ? "py-1.5" : "py-3"}`}
          >
            <span aria-hidden data-fact-bar className="absolute inset-y-0 left-0 w-0.5 bg-ink" />
            <dt data-fact-label className={`caps soft ${chapter ? "pr-14 [--caps-track:0.06em]" : ""}`}><SlotText value={fact.label} /></dt>
            <dd className={`mt-0.5 text-ink ${chapter ? "text-[0.8125rem] leading-snug" : ""}`}><SlotText value={fact.value} /></dd>
            {chapter ? (
              // The toggle sits at the right of the fact's label row (data-reason in globals.css),
              // so a closed reason takes no room of its own.
              <dd className="text-xs">
                <details data-reason>
                  <summary className="soft underline decoration-transparent underline-offset-4 hover:decoration-current">
                    Reason
                  </summary>
                  <p className="soft mt-1 leading-relaxed"><SlotText value={fact.reason} /></p>
                </details>
              </dd>
            ) : (
              <dd className="soft mt-1 text-xs leading-relaxed">Reason: <SlotText value={fact.reason} /></dd>
            )}
            {marks.length > 0 && (
              <dd className="mt-1">
                <ul className={`flex text-xs ${chapter ? "flex-wrap gap-x-3" : "flex-col"}`}>
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
    <aside aria-labelledby="person-card-heading" className={`leaf bg-paper font-interface text-sm ${chapter ? "p-3" : "p-5"}`}>
      <h2 id="person-card-heading" className={`border-b border-(--hair) font-title text-xl ${chapter ? "pb-2" : "pb-3"}`}>Person card</h2>
      <p className={`soft ${chapter ? "mt-2 text-xs leading-snug" : "mt-3 text-[0.8125rem] leading-relaxed"}`}><SlotText value={person.fictionStatement} /></p>
      {rated.length > 0 && (
        <section aria-labelledby="person-card-chapter" className="mt-2 border-t border-(--hair) pt-2">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <h3 id="person-card-chapter" className="caps soft [--caps-track:0.06em]">In this chapter</h3>
            <p className="soft text-xs">Outcome confidence</p>
          </div>
          <ul className="flex flex-wrap gap-x-4">
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
      {chapter ? <CardEmphasis>{facts}</CardEmphasis> : facts}
    </aside>
  );
}
