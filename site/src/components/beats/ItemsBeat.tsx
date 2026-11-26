import type { Item } from "@/content/types";
import { ItemView } from "../ItemView";

export function ItemsBeat({ items }: { items: Item[] }) {
  return (
    <section data-beat="3" id="beat-3" aria-labelledby="beat-3-heading" className="flex flex-col gap-6 p-8">
      <h2 id="beat-3-heading" className="font-title text-2xl">Items</h2>
      {items.length === 0 ? (
        <p className="font-interface text-sm">No items.</p>
      ) : (
        items.map((item) => <ItemView key={item.id} item={item} />)
      )}
    </section>
  );
}
