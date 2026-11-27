// A block gets an entrance only if it starts below the view: anything the reader can already see
// when the reveals are set up, or has scrolled past, is left exactly as it is.
export function startsBelowView(top: number, viewHeight: number): boolean {
  return top >= viewHeight;
}

// How much longer the cover's title card stays up once the new page is there, so it can be read:
// what is left of hold since the cover closed. 0 once that has passed, or if it never closed.
export function coverHoldMs(closedAt: number | null, now: number, hold: number): number {
  if (closedAt === null) return 0;
  return Math.max(0, hold - (now - closedAt));
}
