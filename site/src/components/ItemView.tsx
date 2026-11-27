import { isSlot } from "@/content/slot";
import type { Item } from "@/content/types";
import { CloseView } from "./CloseView";
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

const FIELD = "caps soft mb-1";

export function ItemView({ item }: { item: Item }) {
  // The body sets its own voice and size, so a content-note disclosure around it does not shrink it.
  const body = (
    <div className="flex flex-col gap-5 font-yours text-[1.0625rem] leading-[1.65]">
      <Mount image={item.image} alt={item.alt} gapNote={item.gapNote} />
      <div className="-mx-2 flex flex-wrap gap-x-2">
        <CloseView item={item} />
        {item.image?.largeSrc && (
          <a href={item.image.largeSrc} className="target quiet px-2 text-sm">
            Large image
          </a>
        )}
      </div>
      <dl className="flex flex-col gap-5">
        {isSlot(item.alt) && (
          <div>
            <dt className={FIELD}>Alternative text</dt>
            <dd><SlotText value={item.alt} /></dd>
          </div>
        )}
        <div>
          <dt className={FIELD}>Description</dt>
          <dd className="measure font-yours"><SlotText value={item.longDescription} /></dd>
        </div>
        {item.transcription !== null && (
          <div>
            <dt className={FIELD}>Transcription</dt>
            <dd className="font-source type-source measure whitespace-pre-line border-l-2 border-ink/25 bg-paper-deep px-4 py-3 sm:px-5 sm:py-4">
              <SlotText value={item.transcription} />
            </dd>
          </div>
        )}
        {item.annotations.length > 0 && (
          <div>
            <dt className={FIELD}>Annotations</dt>
            <dd>
              <ol className="measure flex list-decimal flex-col gap-2 pl-7 font-yours marker:font-interface marker:text-sm marker:text-ink-soft">
                {item.annotations.map((a) => (
                  <li key={a.id} id={a.id} className="pl-1"><SlotText value={a.text} /></li>
                ))}
              </ol>
            </dd>
          </div>
        )}
      </dl>
      <Disclosure summary="Provenance">
        <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[auto_1fr]">
          {PROVENANCE_FIELDS.map(([key, label]) => (
            <div key={key} className="contents">
              <dt className="caps soft pt-0.5">{label}</dt>
              <dd className="mb-2 sm:mb-0"><SlotText value={item.provenance[key]} /></dd>
            </div>
          ))}
        </dl>
      </Disclosure>
    </div>
  );

  return (
    <article id={item.id} data-item={item.kind} className="leaf flex flex-col gap-5 bg-paper p-5 sm:p-8">
      <StatusLabel status={item.status} />
      {item.contentNote === null ? (
        body
      ) : (
        <Disclosure summary={<>Content note: <SlotText value={item.contentNote} /></>}>{body}</Disclosure>
      )}
    </article>
  );
}
