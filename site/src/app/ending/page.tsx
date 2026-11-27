import type { Metadata } from "next";
import type { ReactNode } from "react";
import { pageTitle } from "@/app/title";
import { ComparisonMatrix } from "@/components/ending/ComparisonMatrix";
import { ReferenceList } from "@/components/ending/ReferenceList";
import { OPENING_CARD } from "@/components/navLinks";
import { RestartButton } from "@/components/RestartButton";
import { SlotText } from "@/components/SlotText";
import { chapters } from "@/content";
import { ending } from "@/content/pages";
import type { Text } from "@/content/slot";
import { CoverLink } from "@/motion/CoverLink";
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

// Line breaks in a filled note are kept, as in a transcription.
function Body({ value }: { value: Text }) {
  return (
    <p className="measure whitespace-pre-line">
      <SlotText value={value} />
    </p>
  );
}

function Note({ id, heading, value }: { id: string; heading: string; value: Text }) {
  return (
    <Part id={id} heading={heading}>
      <Body value={value} />
    </Part>
  );
}

const CONTROL = "target quiet px-2 text-base hover:text-interface-deep";

// The comparison's cautions come first, then the matrix (ComparisonMatrix), the notes, the
// references and a closing panel. The page is wider than the reading measure so the matrix has
// room for its two columns; every text block keeps the measure.
export default function EndingPage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-16 px-4 py-16 sm:px-8 lg:py-24">
      <Reveal className="font-title type-display">Ending</Reveal>
      <Note id="comparability" heading="Comparing the four cases" value={ending.comparability} />
      <Part id="matrix" heading="Then and now">
        <ComparisonMatrix chapters={chapters} />
      </Part>
      <Note id="reflection" heading="Reflection" value={ending.reflection} />
      <Note id="method" heading="Method note" value={ending.methodNote} />
      <Note id="language" heading="Note on language" value={ending.languageNote} />
      <Part id="references" heading="References">
        <ReferenceList id="bibliography" heading="Bibliography" value={ending.bibliography} />
        <ReferenceList id="credits" heading="Image credits" value={ending.imageCredits} />
      </Part>
      <section aria-labelledby="closing-heading" className="leaf flex flex-col gap-6 bg-sheet p-5 sm:p-8">
        <h2 id="closing-heading" className="font-title type-heading border-b border-(--hair) pb-3">Closing</h2>
        <div className="flex flex-col gap-3">
          <h3 className="font-title text-xl">What is fictional or reconstructed</h3>
          <Body value={ending.fictionStatement} />
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="font-title text-xl">AI-use disclosure</h3>
          <Body value={ending.aiUse} />
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-(--hair) pt-5">
          <CoverLink href="/" card={OPENING_CARD} className={CONTROL}>Return to the opening</CoverLink>
          <RestartButton className={CONTROL}>Start again</RestartButton>
        </div>
      </section>
    </main>
  );
}
