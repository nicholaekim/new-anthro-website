import type { Metadata } from "next";
import type { ReactNode } from "react";
import { pageTitle } from "@/app/title";
import { SlotText } from "@/components/SlotText";
import { chapters } from "@/content";
import { ending } from "@/content/pages";
import type { Text } from "@/content/slot";
import type { Outcome } from "@/content/types";
import { Reveal } from "@/motion/Reveal";

export const metadata: Metadata = { title: pageTitle("Ending") };

function Part({ id, heading, children }: { id: string; heading: string; children: ReactNode }) {
  return (
    <section aria-labelledby={`${id}-heading`} className="flex flex-col gap-5">
      <h2 id={`${id}-heading`} className="font-title type-heading border-b border-rule pb-3">{heading}</h2>
      {children}
    </section>
  );
}

// Line breaks in a filled note are kept, as in a transcription (a bibliography, one entry a line).
// small: reference lists (bibliography, credits), set smaller with room between the lines.
function Note({ id, heading, value, small = false }: { id: string; heading: string; value: Text; small?: boolean }) {
  return (
    <Part id={id} heading={heading}>
      <p className={small ? "measure whitespace-pre-line text-[0.9375rem] leading-[1.8]" : "measure whitespace-pre-line"}>
        <SlotText value={value} />
      </p>
    </Part>
  );
}

function OutcomeRecord({ year, outcome }: { year: number; outcome: Outcome }) {
  return (
    <div data-outcome className="leaf flex flex-col gap-3 bg-sheet p-5 sm:p-6">
      <h4 className="caps soft">Outcome, {year}</h4>
      <p className="measure font-yours"><SlotText value={outcome.text} /></p>
      <p className="font-interface text-sm"><span className="soft">Confidence:</span> <SlotText value={outcome.confidence} /></p>
      <p className="font-interface text-sm"><span className="soft">Citation:</span> <SlotText value={outcome.citation} /></p>
    </div>
  );
}

// Records are shown in sequence, one per chapter. Tobique has no outcome, so only place and years.
export default function EndingPage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-16 px-5 py-16 sm:px-8 lg:py-24">
      <Reveal className="font-title type-display">Ending</Reveal>
      <Note id="comparability" heading="Comparing the four cases" value={ending.comparability} />
      <Part id="records" heading="Records">
        <ol className="flex flex-col gap-10">
          {chapters.map((c) => (
            <li key={c.slug} data-record={c.slug} className="flex flex-col gap-3">
              <h3 className="font-title text-xl">{c.place}, {c.country}</h3>
              <p className="caps soft">{c.historicalYear} and {c.presentYear}</p>
              {c.outcome && <OutcomeRecord year={c.historicalYear} outcome={c.outcome} />}
              {c.present.outcome && <OutcomeRecord year={c.presentYear} outcome={c.present.outcome} />}
            </li>
          ))}
        </ol>
      </Part>
      <Note id="reflection" heading="Reflection" value={ending.reflection} />
      <Note id="method" heading="Method note" value={ending.methodNote} />
      <Note id="language" heading="Note on language" value={ending.languageNote} />
      <Note id="bibliography" heading="Bibliography" value={ending.bibliography} small />
      <Note id="credits" heading="Image credits" value={ending.imageCredits} small />
      <Note id="fiction" heading="What is fictional or reconstructed" value={ending.fictionStatement} />
      <Note id="ai-use" heading="AI-use disclosure" value={ending.aiUse} />
    </main>
  );
}
