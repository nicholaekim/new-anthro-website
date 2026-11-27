import type { Provenance } from "@/content/types";
import { SlotText } from "./SlotText";

const PROVENANCE_FIELDS = [
  ["creator", "Creator"],
  ["title", "Title"],
  ["holder", "Holding institution"],
  ["reference", "Reference number"],
  ["rights", "Rights"],
  ["alterations", "Alterations"],
] as const;

// An item's source information, in the page and in the close view.
export function ProvenanceList({ provenance }: { provenance: Provenance }) {
  return (
    <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[auto_1fr]">
      {PROVENANCE_FIELDS.map(([key, label]) => (
        <div key={key} className="contents">
          <dt className="caps soft pt-0.5">{label}</dt>
          <dd className="mb-2 sm:mb-0"><SlotText value={provenance[key]} /></dd>
        </div>
      ))}
    </dl>
  );
}
