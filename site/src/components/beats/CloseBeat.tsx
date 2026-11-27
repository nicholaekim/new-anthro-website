import type { TitleCard } from "@/motion/cover";
import { CoverLink } from "@/motion/CoverLink";
import { BeatHeading } from "../BeatHeading";

export function CloseBeat({ next }: { next: { href: string; label: string; card?: TitleCard } }) {
  return (
    <section
      data-beat="8"
      id="beat-8"
      aria-labelledby="beat-8-heading"
      className="beat flex min-h-[50svh] flex-col justify-center gap-8 text-paper"
    >
      <BeatHeading beat={8} />
      <CoverLink
        href={next.href}
        card={next.card}
        className="target self-start font-title text-[1.625rem] leading-snug underline decoration-1 underline-offset-[0.2em] hover:text-interface sm:text-3xl"
      >
        {next.label}
      </CoverLink>
    </section>
  );
}
