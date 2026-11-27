import type { Outcome } from "@/content/types";
import { BeatHeading } from "../BeatHeading";
import { Disclosure } from "../Disclosure";
import { SlotText } from "../SlotText";

// Also used for the present-day outcome in beat 7, which carries no mark.
export function OutcomeView({ outcome }: { outcome: Outcome }) {
  return (
    <div className="leaf flex flex-col gap-5 bg-sheet p-6 font-yours sm:p-8">
      <p className="measure"><SlotText value={outcome.text} /></p>
      <p className="measure">
        <span className="caps soft">Confidence: </span>
        <SlotText value={outcome.confidence} />
      </p>
      <Disclosure summary="Citation">
        <SlotText value={outcome.citation} />
      </Disclosure>
    </div>
  );
}

export function OutcomeBeat({ outcome }: { outcome: Outcome }) {
  return (
    <section data-beat="5" id="beat-5" aria-labelledby="beat-5-heading" className="beat flex flex-col gap-10">
      <BeatHeading
        beat={5}
        className="flex items-center gap-3"
        before={<span data-mark aria-hidden="true" className="inline-block size-3 bg-reserved" />}
      />
      <OutcomeView outcome={outcome} />
    </section>
  );
}
