import type { MouseEvent } from "react";
import type { Highlight } from "@/content/regions";

// A document's highlights by name, as small buttons: under the image in the page, where each
// opens the close view at its highlight (opensDialog), and in the close view, where each is
// numbered like its outline and the chosen one is marked (selectedId).
export function HighlightList({
  labelledBy,
  highlights,
  onChoose,
  selectedId,
  opensDialog = false,
}: {
  labelledBy: string;
  highlights: Highlight[];
  onChoose: (id: string, event: MouseEvent<HTMLButtonElement>) => void;
  selectedId?: string | null;
  opensDialog?: boolean;
}) {
  const numbered = selectedId !== undefined;
  return (
    <ul aria-labelledby={labelledBy} className="-mx-2 flex flex-wrap gap-x-1">
      {highlights.map((h, i) => (
        <li key={h.id}>
          <button
            type="button"
            data-highlight-opener={opensDialog ? h.id : undefined}
            aria-haspopup={opensDialog ? "dialog" : undefined}
            aria-current={numbered && h.id === selectedId ? "true" : undefined}
            onClick={(e) => onChoose(h.id, e)}
            className="target quiet gap-1.5 px-2 text-sm aria-[current=true]:border-(--soft) aria-[current=true]:no-underline"
          >
            {numbered && <span aria-hidden className="soft tabular-nums">{i + 1}</span>}
            {h.label}
          </button>
        </li>
      ))}
    </ul>
  );
}
