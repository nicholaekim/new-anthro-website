import type { Basis, Chapter, EraSummary, Item, Outcome } from "@/content/types";
import { ChangeOfDateMotion } from "@/motion/ChangeOfDateMotion";
import { BeatHeading } from "../BeatHeading";
import { Bilingual } from "../Bilingual";
import { ConfidenceMeter } from "../ConfidenceMeter";
import { Disclosure } from "../Disclosure";
import { Mount } from "../Mount";
import { SlotText } from "../SlotText";
import { CONFIDENCE_WORDS, NO_PERSON_PLACED, sectionTag } from "../story";

// Beat 6: the two dates side by side in time. Each era is a complete panel: its year, its
// document ([data-document]) and what the rule says ([data-info]): the instrument's title, who
// decides, on what evidence, the rule as quoted and, where the chapter has outcomes, the outcome's
// confidence. Server-rendered and still, the two panels follow one another. ChangeOfDateMotion
// turns them into one stage with one control once its script runs; nothing here needs a script.
export function ChangeOfDate({ chapter, historical, present }: { chapter: Chapter; historical: Item; present: Item }) {
  return (
    <ChangeOfDateMotion
      historicalYear={chapter.historicalYear}
      presentYear={chapter.presentYear}
      intro={<BeatHeading beat={6} rule={false} />}
      // An empty frame's note would be cut by the wipe: swap the documents at the midpoint instead.
      swap={!historical.image || !present.image}
      eras={{
        historical: (
          <EraPanel
            year={chapter.historicalYear}
            item={historical}
            summary={chapter.summary.historical}
            basis={chapter.basis}
            outcome={chapter.outcome}
            outcomeBeat={5}
            ruleBeat={4}
            placesPerson={chapter.showPersonCard}
          />
        ),
        present: (
          <EraPanel
            year={chapter.presentYear}
            item={present}
            summary={chapter.summary.present}
            basis={chapter.present.basis}
            outcome={chapter.present.outcome}
            outcomeBeat={7}
            ruleBeat={7}
            placesPerson={chapter.showPersonCard}
          />
        ),
      }}
    />
  );
}

function EraPanel({
  year,
  item,
  summary,
  basis,
  outcome,
  outcomeBeat,
  ruleBeat,
  placesPerson,
}: {
  year: number;
  item: Item;
  summary: EraSummary;
  basis: Basis | null;
  outcome: Outcome | null;
  outcomeBeat: 5 | 7;
  ruleBeat: 4 | 7;
  placesPerson: boolean;
}) {
  return (
    <>
      <h3 data-era-year className="font-title text-3xl tabular-nums">{year}</h3>
      <div data-document className="leaf bg-paper p-4">
        {!item.image && (
          <p aria-hidden data-frame-year className="soft pb-3 font-title text-5xl font-light tabular-nums">
            {year}
          </p>
        )}
        {/* eager: a lazy image is not fetched while clipped or hidden (checked in Chrome: an image
            in the 2020 document, cut back to nothing at the start of the wipe, was never
            requested), so it would appear late, once the wipe had begun to uncover it. */}
        <Mount image={item.image} alt={item.alt} gapNote={item.gapNote} eager />
      </div>
      <div data-info className="flex flex-col gap-4 font-interface text-sm">
        <div>
          <p className="caps soft">Instrument</p>
          <p className="mt-1 font-title text-[1.0625rem] leading-snug"><SlotText value={item.provenance.title} /></p>
        </div>
        <dl className="grid gap-3 border-t border-(--hair) pt-3">
          <div>
            <dt className="caps soft">Who decides</dt>
            <dd className="mt-1 font-yours text-base leading-normal"><SlotText value={summary.decides} /></dd>
          </div>
          <div>
            <dt className="caps soft">On what evidence</dt>
            <dd className="mt-1 font-yours text-base leading-normal"><SlotText value={summary.evidence} /></dd>
          </div>
        </dl>
        {basis && (
          <div className="flex flex-col gap-3 border-t border-(--hair) pt-3">
            <p className="caps soft">The rule, as quoted</p>
            <Bilingual
              original={basis.quote}
              translation={basis.quoteTranslation}
              lang={basis.originalLang}
              render={(text, part) => (
                <blockquote
                  data-rule-quote
                  className={`border-l-2 border-paper/40 pl-4 leading-[1.6] whitespace-pre-line ${part === "original" ? "font-source text-[0.875rem]" : "font-yours text-[0.9375rem]"}`}
                >
                  {text}
                </blockquote>
              )}
            />
            {/* While pinned the quotation is shortened to fit the view (globals.css) and this link
                takes its place's citation's: the section it goes to quotes the rule in full. */}
            <a data-full-rule href={`#beat-${ruleBeat}`} className="target quiet self-start hover:text-interface">
              Read the full rule: {sectionTag(ruleBeat)}
            </a>
            <div data-rule-citation>
              <Disclosure summary="Citation">
                <span className="soft"><SlotText value={basis.citation} /></span>
              </Disclosure>
            </div>
          </div>
        )}
        {outcome ? (
          <div className="border-t border-(--hair) pt-3">
            <p className="caps soft">Outcome confidence</p>
            <p className="mt-1 flex items-center gap-2">
              <ConfidenceMeter level={outcome.level} />
              <span>{CONFIDENCE_WORDS[outcome.level]}</span>
            </p>
            <a href={`#beat-${outcomeBeat}`} className="target quiet mt-1 hover:text-interface">
              See the outcome<span className="sr-only">{` (${year})`}</span>
            </a>
          </div>
        ) : (
          !placesPerson && (
            <p className="soft border-t border-(--hair) pt-3">{NO_PERSON_PLACED}</p>
          )
        )}
      </div>
    </>
  );
}
