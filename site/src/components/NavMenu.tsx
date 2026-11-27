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
      <summary className="target quiet px-2 hover:text-interface">Menu</summary>
      <nav aria-label="Site" className="absolute left-0 top-full z-30 mt-2 min-w-64 border border-rule bg-raised p-2 shadow-[0_18px_40px_-16px_rgb(0_0_0/0.8)]">
        <ol className="flex flex-col">
          {links.map((l) => (
            <li key={l.href}>
              <CoverLink
                href={l.href}
                aria-current={l.href === pathname ? "page" : undefined}
                className="target quiet w-full px-2 py-1 text-sm hover:text-interface aria-[current=page]:font-semibold aria-[current=page]:text-interface"
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
