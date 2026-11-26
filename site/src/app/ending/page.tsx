import type { ReactNode } from "react";
import { SlotText } from "@/components/SlotText";
import { chapters } from "@/content";
import { ending } from "@/content/pages";
import type { Text } from "@/content/slot";
import type { Outcome } from "@/content/types";

function Part({ id, heading, children }: { id: string; heading: string; children: ReactNode }) {
  return (
    <section aria-labelledby={`${id}-heading`} className="flex flex-col gap-2">
      <h2 id={`${id}-heading`} className="font-title text-2xl">{heading}</h2>
      {children}
    </section>
  );
}

function Note({ id, heading, value }: { id: string; heading: string; value: Text }) {
  return (
    <Part id={id} heading={heading}>
      <p><SlotText value={value} /></p>
    </Part>
  );
}

function OutcomeRecord({ year, outcome }: { year: number; outcome: Outcome }) {
  return (
    <div data-outcome className="bg-sheet p-3 text-ink">
      <h4 className="font-interface text-sm font-semibold">Outcome, {year}</h4>
      <p className="font-yours"><SlotText value={outcome.text} /></p>
      <p className="font-interface text-sm">Confidence: <SlotText value={outcome.confidence} /></p>
      <p className="font-interface text-sm">Citation: <SlotText value={outcome.citation} /></p>
    </div>
  );
}

// Records are shown in sequence, one per chapter. Tobique has no outcome, so only place and years.
export default function EndingPage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 p-8">
      <h1 className="font-title text-5xl">Ending</h1>
      <Note id="comparability" heading="Comparing the four cases" value={ending.comparability} />
      <Part id="records" heading="Records">
        <ol className="flex flex-col gap-4">
          {chapters.map((c) => (
            <li key={c.slug} data-record={c.slug} className="flex flex-col gap-2">
              <h3 className="font-title text-xl">{c.place}, {c.country}</h3>
              <p className="font-interface text-sm">{c.historicalYear} and {c.presentYear}</p>
              {c.outcome && <OutcomeRecord year={c.historicalYear} outcome={c.outcome} />}
              {c.present.outcome && <OutcomeRecord year={c.presentYear} outcome={c.present.outcome} />}
            </li>
          ))}
        </ol>
      </Part>
      <Note id="reflection" heading="Reflection" value={ending.reflection} />
      <Note id="method" heading="Method note" value={ending.methodNote} />
      <Note id="language" heading="Note on language" value={ending.languageNote} />
      <Note id="bibliography" heading="Bibliography" value={ending.bibliography} />
      <Note id="credits" heading="Image credits" value={ending.imageCredits} />
      <Note id="fiction" heading="What is fictional or reconstructed" value={ending.fictionStatement} />
      <Note id="ai-use" heading="AI-use disclosure" value={ending.aiUse} />
    </main>
  );
}
