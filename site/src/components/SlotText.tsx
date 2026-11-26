import { isSlot, type Text } from "@/content/slot";

// A slot is a visibly marked placeholder; a string is the student's text.
export function SlotText({ value }: { value: Text }) {
  if (!isSlot(value)) return <>{value}</>;
  return (
    <span data-slot className="outline-1 outline-offset-2 outline-dashed">
      [{value.slot}]
    </span>
  );
}
