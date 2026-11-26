"use client";

import { createContext, use, useSyncExternalStore, type ReactNode } from "react";
import { STORAGE_PREFIX } from "@/lib/storage";
import { resolveMotionMode, type MotionMode } from "./motionMode";

const MOTION_KEY = `${STORAGE_PREFIX}motion`;
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

// The override lives in sessionStorage; writes from the switch notify the provider.
const listeners = new Set<() => void>();

function subscribeOverride(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

function readOverride(): MotionMode | null {
  try {
    const value = sessionStorage.getItem(MOTION_KEY);
    return value === "full" || value === "still" ? value : null;
  } catch {
    return null; // storage unavailable: no override
  }
}

function writeOverride(mode: MotionMode) {
  try {
    sessionStorage.setItem(MOTION_KEY, mode);
  } catch {
    // storage unavailable: the switch still works until the page is left
  }
  listeners.forEach((l) => l());
}

function subscribeReduced(onChange: () => void) {
  const query = window.matchMedia(REDUCED_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

const MotionContext = createContext<{ mode: MotionMode; setMode: (mode: MotionMode) => void }>({
  mode: "still",
  setMode: writeOverride,
});

// On the server and during hydration the reduced preference reads as true, so the page renders
// and hydrates still; motion is set up only after the client values are known.
export function MotionProvider({ children }: { children: ReactNode }) {
  const reduced = useSyncExternalStore(subscribeReduced, () => window.matchMedia(REDUCED_QUERY).matches, () => true);
  const override = useSyncExternalStore(subscribeOverride, readOverride, () => null);
  return <MotionContext value={{ mode: resolveMotionMode(reduced, override), setMode: writeOverride }}>{children}</MotionContext>;
}

export function useMotionMode() {
  return use(MotionContext);
}
