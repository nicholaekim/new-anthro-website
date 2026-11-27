import type { Metadata } from "next";
import { PersonCardView } from "@/components/PersonCardView";
import { SlotText } from "@/components/SlotText";
import { chapters, person } from "@/content";
import { opening } from "@/content/pages";
import { CoverLink } from "@/motion/CoverLink";
import { OpeningMotion } from "@/motion/OpeningMotion";
import { Reveal } from "@/motion/Reveal";
import { pageTitle } from "./title";

export const metadata: Metadata = { title: pageTitle("Opening") };

// The light and the border around the person card are decoration, present in the still page. They
// are marked data-reveal so the pending mark covers them until the opening sequence is set up.
export default function OpeningPage() {
  const first = chapters[0];
  return (
    <OpeningMotion>
      {/* px-6 at least: the light behind the person card reaches 1.5rem past it (-inset-6). */}
      <main className="mx-auto flex max-w-3xl flex-col gap-14 px-6 py-16 sm:px-8 lg:py-24">
        {/* max-w-[14em]: breaks the title into two balanced lines instead of one long one. */}
        <Reveal className="font-title type-display max-w-[14em]">
          <SlotText value={opening.title} />
        </Reveal>
        <section aria-labelledby="framing-heading" className="flex flex-col gap-4">
          <h2 id="framing-heading" className="font-title type-heading border-b border-rule pb-3">Introduction</h2>
          <p className="type-lead"><SlotText value={opening.framing} /></p>
        </section>
        <div className="relative isolate mx-auto my-6 w-full max-w-md">
          <div
            data-opening-light
            data-reveal
            aria-hidden="true"
            className="pointer-events-none absolute -inset-6 -z-10 bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--color-paper)_22%,transparent),transparent)]"
          />
          <div data-opening-border data-reveal aria-hidden="true" className="pointer-events-none absolute -inset-3">
            <span data-opening-bar="x" className="absolute inset-x-0 top-0 h-px bg-paper" />
            <span data-opening-bar="x" className="absolute inset-x-0 bottom-0 h-px bg-paper" />
            <span data-opening-bar="y" className="absolute inset-y-0 left-0 w-px bg-paper" />
            <span data-opening-bar="y" className="absolute inset-y-0 right-0 w-px bg-paper" />
          </div>
          <PersonCardView person={person} used={[]} />
        </div>
        <section aria-labelledby="site-note-heading" className="flex flex-col gap-3">
          <h2 id="site-note-heading" className="font-title text-xl">Note on language and content</h2>
          <p className="measure soft text-base leading-relaxed"><SlotText value={opening.siteNote} /></p>
        </section>
        <CoverLink
          href={`/chapters/${first.slug}`}
          className="target self-start border border-paper/70 px-6 py-3 font-interface text-sm tracking-[0.04em] text-paper hover:border-paper hover:bg-paper hover:text-ink"
        >
          Begin: {first.place}, {first.historicalYear}
        </CoverLink>
      </main>
    </OpeningMotion>
  );
}
