import type { ReactNode } from "react";

// A section's opening, like a catalogue entry: the beat number (decoration only: the heading
// already names the section), the heading, then a thin rule unless the beat draws its own.
export function BeatHeading({
  beat,
  rule = true,
  className = "",
  children,
}: {
  beat: number;
  rule?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={rule ? "opening" : "flex flex-col gap-2"}>
      <p aria-hidden className="caps soft">{String(beat).padStart(2, "0")}</p>
      <h2 id={`beat-${beat}-heading`} className={`font-title type-heading ${className}`}>
        {children}
      </h2>
    </div>
  );
}
