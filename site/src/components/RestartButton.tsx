"use client";

import { clearStored } from "@/lib/storage";
import { CoverLink } from "@/motion/CoverLink";

// A link, so it still returns to the opening without scripts; with scripts it also clears storage.
export function RestartButton() {
  return (
    <CoverLink href="/" onClick={clearStored} className="target quiet px-2 hover:text-interface">
      Restart
    </CoverLink>
  );
}
