"use client";

import { clearStored } from "@/lib/storage";
import { CoverLink } from "@/motion/CoverLink";

// A link, so it still returns to the opening without scripts; with scripts it also clears storage.
export function RestartButton() {
  return (
    <CoverLink href="/" onClick={clearStored} className="target px-2 font-interface underline">
      Restart
    </CoverLink>
  );
}
