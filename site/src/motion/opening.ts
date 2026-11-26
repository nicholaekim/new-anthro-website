import { STORAGE_PREFIX } from "@/lib/storage";
import type { MotionMode } from "./motionMode";

// Set once the opening sequence has played or been skipped; Restart clears it (clearStored).
export const OPENING_SEEN_KEY = `${STORAGE_PREFIX}opening-seen`;

export function shouldPlayOpening(mode: MotionMode, seen: boolean): boolean {
  return mode === "full" && !seen;
}

export function readOpeningSeen(): boolean {
  try {
    return sessionStorage.getItem(OPENING_SEEN_KEY) !== null;
  } catch {
    return false; // storage unavailable: not seen, so the sequence plays once per page view
  }
}

export function storeOpeningSeen(): void {
  try {
    sessionStorage.setItem(OPENING_SEEN_KEY, "1");
  } catch {
    // storage unavailable or full: the sequence plays again on the next visit to the opening
  }
}
