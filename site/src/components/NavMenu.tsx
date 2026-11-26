"use client";

import { usePathname } from "next/navigation";
import type { FocusEvent, KeyboardEvent, MouseEvent } from "react";
import { CoverLink } from "@/motion/CoverLink";
import type { NavLink } from "./navLinks";

// A native disclosure: the links are in the HTML and work without scripts. With scripts the
// panel closes on Escape, when focus leaves it, and when any of its links is chosen.
// The links come from the server (navLinks), so the chapter content stays out of the client bundle.
export function NavMenu({ links }: { links: readonly NavLink[] }) {
  const pathname = usePathname();

  function onKeyDown(e: KeyboardEvent<HTMLDetailsElement>) {
    if (e.key !== "Escape" || !e.currentTarget.open) return;
    e.currentTarget.open = false;
    e.currentTarget.querySelector("summary")?.focus();
  }

  function onBlur(e: FocusEvent<HTMLDetailsElement>) {
    if (!e.currentTarget.contains(e.relatedTarget)) e.currentTarget.open = false;
  }

  function onClick(e: MouseEvent<HTMLDetailsElement>) {
    if ((e.target as Element).closest("a")) e.currentTarget.open = false;
  }

  return (
    <details data-nav-menu className="relative" onKeyDown={onKeyDown} onBlur={onBlur} onClick={onClick}>
      <summary className="target px-2 font-interface">Menu</summary>
      <nav aria-label="Site" className="absolute left-0 top-full z-30 mt-1 min-w-64 bg-surround p-2 shadow-lg outline outline-interface">
        <ol className="flex flex-col">
          {links.map((l) => (
            <li key={l.href}>
              <CoverLink
                href={l.href}
                aria-current={l.href === pathname ? "page" : undefined}
                className="target w-full px-2 underline aria-[current=page]:font-semibold"
              >
                {l.label}
              </CoverLink>
            </li>
          ))}
        </ol>
      </nav>
    </details>
  );
}
