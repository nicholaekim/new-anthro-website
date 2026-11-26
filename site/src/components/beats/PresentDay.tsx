import type { Chapter, PersonCard } from "@/content/types";
import { ItemView } from "../ItemView";
import { Mount } from "../Mount";
import { SlotText } from "../SlotText";
import { BasisView } from "./BasisBeat";
import { OutcomeView } from "./OutcomeBeat";

export function PresentDay({ chapter, person }: { chapter: Chapter; person: PersonCard | null }) {
  const { instrument, basis, outcome, reflection } = chapter.present;
  return (
    <section data-beat="7" id="beat-7" aria-labelledby="beat-7-heading" className="flex flex-col gap-6 p-8">
      <h2 id="beat-7-heading" className="font-title text-2xl">Present day, {chapter.presentYear}</h2>
      <div className="flex flex-col gap-3">
        <h3 className="font-interface text-sm">Instrument</h3>
        {instrument ? <ItemView item={instrument} /> : <Mount image={null} alt="" />}
      </div>
      {basis && (
        <div className="flex flex-col gap-3">
          <h3 className="font-interface text-sm">Basis</h3>
          <BasisView basis={basis} person={person} />
        </div>
      )}
      {outcome && (
        <div className="flex flex-col gap-3">
          <h3 className="font-interface text-sm">Outcome</h3>
          <OutcomeView outcome={outcome} />
        </div>
      )}
      <div className="flex flex-col gap-3">
        <h3 className="font-interface text-sm">Reflection</h3>
        <p className="font-yours"><SlotText value={reflection} /></p>
      </div>
    </section>
  );
}
