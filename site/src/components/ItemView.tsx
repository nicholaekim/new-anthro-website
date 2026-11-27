import { isSlot } from "@/content/slot";
import type { Item } from "@/content/types";
import { Transcription } from "./Bilingual";
import { CloseView } from "./CloseView";
import { Disclosure } from "./Disclosure";
import { Mount } from "./Mount";
import { ProvenanceList } from "./ProvenanceList";
import { SlotText } from "./SlotText";
import { StatusLabel } from "./StatusLabel";

const FIELD = "caps soft mb-1";

export function ItemView({ item }: { item: Item }) {
  // The body sets its own voice and size, so a content-note disclosure around it does not shrink it.
  const body = (
    <div className="flex flex-col gap-5 font-yours text-[1.0625rem] leading-[1.65]">
      <Mount image={item.image} alt={item.alt} gapNote={item.gapNote} />
      <CloseView item={item}>
        {item.image?.largeSrc && (
          <a href={item.image.largeSrc} className="target quiet px-2 text-sm">
            Large image
          </a>
        )}
      </CloseView>
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
            <dd>
              <Transcription text={item.transcription} translation={item.translation} />
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
        <ProvenanceList provenance={item.provenance} />
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
