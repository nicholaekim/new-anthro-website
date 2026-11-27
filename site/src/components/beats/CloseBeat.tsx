import { CoverLink } from "@/motion/CoverLink";
import { BeatHeading } from "../BeatHeading";

export function CloseBeat({ next }: { next: { href: string; label: string } }) {
  return (
    <section
      data-beat="8"
      id="beat-8"
      aria-labelledby="beat-8-heading"
      className="beat flex min-h-[50svh] flex-col justify-center gap-8 bg-surround text-paper"
    >
      <BeatHeading beat={8}>Next</BeatHeading>
      <CoverLink
        href={next.href}
        className="target self-start font-title text-[1.625rem] leading-snug underline decoration-1 underline-offset-[0.2em] hover:text-interface sm:text-3xl"
      >
        {next.label}
      </CoverLink>
    </section>
  );
}
