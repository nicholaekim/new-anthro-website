import type { Item } from "@/content/types";
import { BeatHeading } from "../BeatHeading";
import { ItemView } from "../ItemView";

export function ItemsBeat({ items }: { items: Item[] }) {
  return (
    <section data-beat="3" id="beat-3" aria-labelledby="beat-3-heading" className="beat flex flex-col gap-12">
      <BeatHeading beat={3}>Items</BeatHeading>
      {items.length === 0 ? (
        <p className="soft font-interface text-sm">No items.</p>
      ) : (
        items.map((item) => <ItemView key={item.id} item={item} />)
      )}
    </section>
  );
}
