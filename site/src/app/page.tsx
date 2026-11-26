import type { Metadata } from "next";
import Link from "next/link";
import { PersonCardView } from "@/components/PersonCardView";
import { SlotText } from "@/components/SlotText";
import { chapters, person } from "@/content";
import { opening } from "@/content/pages";
import { pageTitle } from "./title";

export const metadata: Metadata = { title: pageTitle("Opening") };

export default function OpeningPage() {
  const first = chapters[0];
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 p-8">
      <h1 className="font-title text-5xl">
        <SlotText value={opening.title} />
      </h1>
      <section aria-labelledby="framing-heading" className="flex flex-col gap-2">
        <h2 id="framing-heading" className="font-title text-2xl">Introduction</h2>
        <p><SlotText value={opening.framing} /></p>
      </section>
      <PersonCardView person={person} used={[]} />
      <section aria-labelledby="site-note-heading" className="flex flex-col gap-2">
        <h2 id="site-note-heading" className="font-title text-2xl">Note on language and content</h2>
        <p><SlotText value={opening.siteNote} /></p>
      </section>
      <Link href={`/chapters/${first.slug}`} className="target self-start font-interface underline">
        Begin: {first.place}, {first.historicalYear}
      </Link>
    </main>
  );
}
