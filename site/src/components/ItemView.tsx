import { isSlot } from "@/content/slot";
import type { Item } from "@/content/types";
import { Disclosure } from "./Disclosure";
import { Mount } from "./Mount";
import { SlotText } from "./SlotText";
import { StatusLabel } from "./StatusLabel";

const PROVENANCE_FIELDS = [
  ["creator", "Creator"],
  ["title", "Title"],
  ["holder", "Holding institution"],
  ["reference", "Reference number"],
  ["rights", "Rights"],
  ["alterations", "Alterations"],
] as const;

export function ItemView({ item }: { item: Item }) {
  const body = (
    <div className="flex flex-col gap-3">
      <Mount image={item.image} alt={item.alt}>
        {item.gapNote !== null && <SlotText value={item.gapNote} />}
      </Mount>
      <dl className="flex flex-col gap-2">
        {isSlot(item.alt) && (
          <div>
            <dt className="font-interface text-xs">Alternative text</dt>
            <dd><SlotText value={item.alt} /></dd>
          </div>
        )}
        <div>
          <dt className="font-interface text-xs">Description</dt>
          <dd className="font-yours"><SlotText value={item.longDescription} /></dd>
        </div>
        {item.transcription !== null && (
          <div>
            <dt className="font-interface text-xs">Transcription</dt>
            <dd className="font-source whitespace-pre-line"><SlotText value={item.transcription} /></dd>
          </div>
        )}
        {item.annotations.length > 0 && (
          <div>
            <dt className="font-interface text-xs">Annotations</dt>
            <dd>
              <ol className="list-decimal pl-5 font-yours">
                {item.annotations.map((a) => (
                  <li key={a.id} id={a.id}><SlotText value={a.text} /></li>
                ))}
              </ol>
            </dd>
          </div>
        )}
      </dl>
      <Disclosure summary="Provenance">
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
          {PROVENANCE_FIELDS.map(([key, label]) => (
            <div key={key} className="contents">
              <dt>{label}</dt>
              <dd><SlotText value={item.provenance[key]} /></dd>
            </div>
          ))}
        </dl>
      </Disclosure>
    </div>
  );

  return (
    <article id={item.id} data-item={item.kind} className="flex flex-col gap-3 bg-paper p-4 text-ink">
      <StatusLabel status={item.status} />
      {item.contentNote === null ? (
        body
      ) : (
        <Disclosure summary={<>Content note: <SlotText value={item.contentNote} /></>}>{body}</Disclosure>
      )}
    </article>
  );
}
