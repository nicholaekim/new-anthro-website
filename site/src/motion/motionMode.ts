import { STORAGE_PREFIX } from "@/lib/storage";

export type MotionMode = "full" | "still";

// Where the Motion switch's choice is stored, and the system preference it overrides. Kept in
// this plain module so the server layout's inline script can use them too.
export const MOTION_KEY = `${STORAGE_PREFIX}motion`;
export const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

// The visible switch wins over the system preference; without it, reduced motion means still.
export function resolveMotionMode(systemReduced: boolean, override: MotionMode | null): MotionMode {
  return override ?? (systemReduced ? "still" : "full");
}
