"use client";

import { useEffect } from "react";
import { useMotionMode } from "./MotionProvider";
import { PENDING_ATTR } from "./pending";

// Once in the layout, inside the motion provider. Its effect runs after every layout effect of
// the same commit, so the reveals' set-ups (useGSAP runs in a layout effect) exist by then. It
// waits for ready: before it the mode still reads as still, and nothing is set up yet.
export function MotionReady() {
  const { ready } = useMotionMode();
  useEffect(() => {
    if (ready) document.documentElement.removeAttribute(PENDING_ATTR);
  }, [ready]);
  return null;
}
