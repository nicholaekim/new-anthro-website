// Every key the site stores in sessionStorage starts with this prefix.
export const STORAGE_PREFIX = "opmb:";

export function clearStored(): void {
  try {
    const keys = Array.from({ length: sessionStorage.length }, (_, i) => sessionStorage.key(i));
    for (const key of keys) if (key?.startsWith(STORAGE_PREFIX)) sessionStorage.removeItem(key);
  } catch {
    // Storage can be unavailable (blocked or private mode); there is nothing to clear.
  }
}
