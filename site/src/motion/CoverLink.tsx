"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useCover } from "./CoverProvider";

// A Link whose client-side navigation goes through the cover. onNavigate runs only for plain
// clicks on in-app links (not modified clicks, downloads or external URLs); when the cover takes
// the navigation it cancels Link's own and pushes the route itself once the page is covered.
export function CoverLink(props: ComponentProps<typeof Link>) {
  const { start } = useCover();
  const { href, onNavigate } = props;
  return (
    <Link
      {...props}
      onNavigate={(e) => {
        onNavigate?.(e);
        if (typeof href === "string" && start(href)) e.preventDefault();
      }}
    />
  );
}
