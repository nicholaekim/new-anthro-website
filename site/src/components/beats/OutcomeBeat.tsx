import type { Outcome } from "@/content/types";
import { Disclosure } from "../Disclosure";
import { SlotText } from "../SlotText";

// Also used for the present-day outcome in beat 7, which carries no mark.
export function OutcomeView({ outcome }: { outcome: Outcome }) {
  return (
    <div className="flex flex-col gap-3 bg-sheet p-4 font-yours text-ink">
      <p><SlotText value={outcome.text} /></p>
      <p>
        <span className="font-interface text-xs">Confidence: </span>
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
    <section data-beat="5" id="beat-5" aria-labelledby="beat-5-heading" className="flex flex-col gap-4 p-8">
      <h2 id="beat-5-heading" className="flex items-center gap-3 font-title text-2xl">
        <span data-mark aria-hidden="true" className="inline-block size-3 bg-reserved" />
        Outcome
      </h2>
      <OutcomeView outcome={outcome} />
    </section>
  );
}
