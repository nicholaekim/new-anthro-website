// A research slot: the note says what the student must supply here.
export type Slot = { readonly slot: string };

export const slot = (note: string): Slot => ({ slot: note });

// Fill a slot by replacing slot('…') with a string.
export type Text = string | Slot;

export const isSlot = (t: Text): t is Slot =>
  typeof t === "object" && t !== null && typeof t.slot === "string";
