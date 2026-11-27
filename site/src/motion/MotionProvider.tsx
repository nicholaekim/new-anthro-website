"use client";

import { createContext, use, useEffect, useSyncExternalStore, type ReactNode } from "react";
import { MOTION_ATTR, MOTION_KEY, REDUCED_QUERY, resolveMotionMode, type MotionMode } from "./motionMode";

// The override lives in memory, which is what the provider reads; sessionStorage only persists it
// across reloads. It is read from storage once, on first use. If storage cannot be written, the
// switch still works until the page is reloaded.
const listeners = new Set<() => void>();
let memoryOverride: MotionMode | null | undefined; // undefined: not read from storage yet

function subscribeOverride(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

function readStored(): MotionMode | null {
  try {
    const value = sessionStorage.getItem(MOTION_KEY);
    return value === "full" || value === "still" ? value : null;
  } catch {
    return null; // storage unavailable: no stored override
  }
}

function readOverride(): MotionMode | null {
  if (memoryOverride === undefined) memoryOverride = readStored();
  return memoryOverride;
}

function writeOverride(mode: MotionMode) {
  memoryOverride = mode;
  try {
    sessionStorage.setItem(MOTION_KEY, mode);
  } catch {
    // storage unavailable or full: the choice is kept in memory only
  }
  listeners.forEach((l) => l());
}

function subscribeReduced(onChange: () => void) {
  const query = window.matchMedia(REDUCED_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

const noSubscription = () => () => {};

const MotionContext = createContext<{ mode: MotionMode; ready: boolean; setMode: (mode: MotionMode) => void }>({
  mode: "still",
  ready: false,
  setMode: writeOverride,
});

// On the server and during hydration the reduced preference reads as true, so the page renders
// and hydrates still; motion is set up only after the client values are known. ready turns true
// in that same commit (at once on a client-side navigation), after which the set-ups exist.
export function MotionProvider({ children }: { children: ReactNode }) {
  const reduced = useSyncExternalStore(subscribeReduced, () => window.matchMedia(REDUCED_QUERY).matches, () => true);
  const override = useSyncExternalStore(subscribeOverride, readOverride, () => null);
  const ready = useSyncExternalStore(noSubscription, () => true, () => false);
  const mode = resolveMotionMode(reduced, override);
  // Only once ready: before it the mode reads as still whatever the client values, and the inline
  // script has already set the attribute from them.
  useEffect(() => {
    if (ready) document.documentElement.setAttribute(MOTION_ATTR, mode);
  }, [ready, mode]);
  return (
    <MotionContext value={{ mode, ready, setMode: writeOverride }}>{children}</MotionContext>
  );
}

export function useMotionMode() {
  return use(MotionContext);
}
