"use client";

import type { ReactNode } from "react";
import { clearStored } from "@/lib/storage";
import { CoverLink } from "@/motion/CoverLink";
import { OPENING_CARD } from "./navLinks";

// A link, so it still returns to the opening without scripts; with scripts it also clears storage.
// The header's "Restart"; the ending's closing panel names it "Start again".
export function RestartButton({ children = "Restart", className = "target quiet px-2 hover:text-interface" }: { children?: ReactNode; className?: string }) {
  return (
    <CoverLink href="/" card={OPENING_CARD} onClick={clearStored} className={className}>
      {children}
    </CoverLink>
  );
}
