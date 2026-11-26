import { CoverLink } from "@/motion/CoverLink";

export function CloseBeat({ next }: { next: { href: string; label: string } }) {
  return (
    <section data-beat="8" id="beat-8" aria-labelledby="beat-8-heading" className="flex min-h-[50svh] flex-col justify-center gap-4 bg-surround p-8 text-paper">
      <h2 id="beat-8-heading" className="font-title text-2xl">Next</h2>
      <CoverLink href={next.href} className="target font-interface underline">
        {next.label}
      </CoverLink>
    </section>
  );
}
