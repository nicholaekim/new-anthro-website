import type { Chapter, PersonCard } from "@/content/types";
import { BeatHeading } from "../BeatHeading";
import { ItemView } from "../ItemView";
import { Mount } from "../Mount";
import { SlotText } from "../SlotText";
import { BasisView } from "./BasisBeat";
import { OutcomeView } from "./OutcomeBeat";

// Each part opens with a small label, below the section's own opening.
const PART = "flex flex-col gap-4";
const PART_HEADING = "caps soft";

export function PresentDay({ chapter, person }: { chapter: Chapter; person: PersonCard | null }) {
  const { instrument, basis, outcome, reflection } = chapter.present;
  return (
    <section data-beat="7" id="beat-7" aria-labelledby="beat-7-heading" className="beat flex flex-col gap-14">
      <BeatHeading beat={7}>Present day, {chapter.presentYear}</BeatHeading>
      <div className={PART}>
        <h3 className={PART_HEADING}>Instrument</h3>
        {instrument ? <ItemView item={instrument} /> : <Mount image={null} alt="" />}
      </div>
      {basis && (
        <div className={PART}>
          <h3 className={PART_HEADING}>Basis</h3>
          <BasisView basis={basis} person={person} />
        </div>
      )}
      {outcome && (
        <div className={PART}>
          <h3 className={PART_HEADING}>Outcome</h3>
          <OutcomeView outcome={outcome} />
        </div>
      )}
      <div className={PART}>
        <h3 className={PART_HEADING}>Reflection</h3>
        <p className="measure"><SlotText value={reflection} /></p>
      </div>
    </section>
  );
}
