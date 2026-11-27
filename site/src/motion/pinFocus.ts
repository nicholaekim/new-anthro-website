type Span = { top: number; bottom: number };

// A pinned wrapper can be taller than the slot it is pinned in (between the header and the beat
// bar), so keyboard focus can land on a control below the slot. While pinned, the wrapper sits
// where it will be at the pin's end; after that end it scrolls normally. So the element comes
// into view at the pin's end plus how far it lies below the slot, plus a margin. null: it is in view.
export function scrollTargetForFocus(element: Span, slot: Span, pinEnd: number, margin: number): number | null {
  if (element.top >= slot.top && element.bottom <= slot.bottom) return null;
  return pinEnd + (element.bottom - slot.bottom) + margin;
}
