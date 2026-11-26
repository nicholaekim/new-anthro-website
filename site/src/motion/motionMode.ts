export type MotionMode = "full" | "still";

// The visible switch wins over the system preference; without it, reduced motion means still.
export function resolveMotionMode(systemReduced: boolean, override: MotionMode | null): MotionMode {
  return override ?? (systemReduced ? "still" : "full");
}
