"use client";

import Link from "next/link";
import { clearStored } from "@/lib/storage";

// A link, so it still returns to the opening without scripts; with scripts it also clears storage.
export function RestartButton() {
  return (
    <Link href="/" onClick={clearStored} className="target px-2 font-interface underline">
      Restart
    </Link>
  );
}
