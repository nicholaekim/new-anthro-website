"use client";

import { useMotionMode } from "@/motion/MotionProvider";

// Pressed while motion is full. The choice overrides the system preference for this visit.
export function MotionSwitch() {
  const { mode, setMode } = useMotionMode();
  return (
    <button
      type="button"
      aria-pressed={mode === "full"}
      onClick={() => setMode(mode === "full" ? "still" : "full")}
      className="target quiet px-2 hover:text-interface"
    >
      Motion
    </button>
  );
}
