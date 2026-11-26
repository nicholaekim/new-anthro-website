// Every key the site stores in sessionStorage starts with this prefix.
export const STORAGE_PREFIX = "opmb:";

// Counts the clears, so a page that is already showing (the opening, when Restart is chosen on
// it) can start again: Restart to the same path does not remount the page.
let clears = 0;
const clearListeners = new Set<() => void>();

export function subscribeClears(onClear: () => void): () => void {
  clearListeners.add(onClear);
  return () => {
    clearListeners.delete(onClear);
  };
}

export function clearCount(): number {
  return clears;
}

export function clearStored(): void {
  try {
    const keys = Array.from({ length: sessionStorage.length }, (_, i) => sessionStorage.key(i));
    for (const key of keys) if (key?.startsWith(STORAGE_PREFIX)) sessionStorage.removeItem(key);
  } catch {
    // Storage can be unavailable (blocked or private mode); there is nothing to clear.
  }
  clears += 1;
  clearListeners.forEach((l) => l());
}
