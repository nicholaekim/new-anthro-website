import { Fragment } from "react";
import { isSlot, type Text } from "@/content/slot";
import { SlotText } from "../SlotText";
import { linkSegments, parseReferences } from "./references";

// One reference note (the bibliography or the image credits), read into groups at render time:
// each group with a heading opens from it, one entry a line with a hanging indent; a group with
// no heading is a plain list, always shown. A note that is still a slot shows its placeholder.
export function ReferenceList({ id, heading, value }: { id: string; heading: string; value: Text }) {
  return (
    <section aria-labelledby={`${id}-heading`} className="flex flex-col gap-3">
      <h3 id={`${id}-heading`} className="font-title text-xl">{heading}</h3>
      {isSlot(value) ? (
        <p><SlotText value={value} /></p>
      ) : (
        parseReferences(value).map((group, i) =>
          group.heading ? (
            <details key={i} className="border-t border-(--hair) pt-2 font-interface">
              <summary className="py-1 text-[0.9375rem] underline decoration-transparent underline-offset-4 marker:text-(--soft) hover:decoration-current">
                {group.heading}
              </summary>
              <Entries entries={group.entries} />
            </details>
          ) : (
            <div key={i} className="border-t border-(--hair) pt-3">
              <Entries entries={group.entries} />
            </div>
          ),
        )
      )}
    </section>
  );
}

function Entries({ entries }: { entries: string[] }) {
  return (
    <ul className="measure mt-2 mb-3 flex flex-col gap-2 text-[0.9375rem] leading-[1.6]">
      {entries.map((entry, i) => (
        <li key={i} className="pl-6 -indent-6">
          {linkSegments(entry).map((s, j) =>
            s.href ? (
              <a key={j} href={s.href} className="underline decoration-(--soft) hover:decoration-current">
                {s.text}
              </a>
            ) : (
              <Fragment key={j}>{s.text}</Fragment>
            ),
          )}
        </li>
      ))}
    </ul>
  );
}
