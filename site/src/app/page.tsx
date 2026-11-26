import type { Metadata } from "next";
import Link from "next/link";
import { PersonCardView } from "@/components/PersonCardView";
import { SlotText } from "@/components/SlotText";
import { chapters, person } from "@/content";
import { opening } from "@/content/pages";
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
      <main className="mx-auto flex max-w-3xl flex-col gap-8 p-8">
        <Reveal className="font-title text-5xl">
          <SlotText value={opening.title} />
        </Reveal>
        <section aria-labelledby="framing-heading" className="flex flex-col gap-2">
          <h2 id="framing-heading" className="font-title text-2xl">Introduction</h2>
          <p><SlotText value={opening.framing} /></p>
        </section>
        <div className="relative isolate">
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
        <section aria-labelledby="site-note-heading" className="flex flex-col gap-2">
          <h2 id="site-note-heading" className="font-title text-2xl">Note on language and content</h2>
          <p><SlotText value={opening.siteNote} /></p>
        </section>
        <Link href={`/chapters/${first.slug}`} className="target self-start font-interface underline">
          Begin: {first.place}, {first.historicalYear}
        </Link>
      </main>
    </OpeningMotion>
  );
}
