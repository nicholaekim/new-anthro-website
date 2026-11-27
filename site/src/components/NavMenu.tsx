"use client";

import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";
import { CoverLink } from "@/motion/CoverLink";
import type { NavLink } from "./navLinks";
import { useDismiss } from "./useDismiss";

// A native disclosure: the links are in the HTML and work without scripts. With scripts the
// panel closes on Escape, when focus leaves it, on a press outside it (useDismiss), and when any
// of its links is chosen.
// The links come from the server (navLinks), so the chapter content stays out of the client bundle.
export function NavMenu({ links }: { links: readonly NavLink[] }) {
  const pathname = usePathname();
  const { ref, onKeyDown, onBlur } = useDismiss();

  function onClick(e: MouseEvent<HTMLDetailsElement>) {
    if ((e.target as Element).closest("a")) e.currentTarget.open = false;
  }

  return (
    <details ref={ref} data-nav-menu className="relative" onKeyDown={onKeyDown} onBlur={onBlur} onClick={onClick}>
      <summary className="target quiet px-2 hover:text-interface">Menu</summary>
      {/* The shadow is the sheets' low shadow, deeper, so the panel reads as lifted above the page. */}
      <nav aria-label="Site" className="absolute left-0 top-full z-30 mt-2 min-w-64 border border-rule bg-raised p-2 shadow-[0_18px_40px_-16px_rgb(0_0_0/0.8)]">
        <ol className="flex flex-col">
          {links.map((l) => (
            <li key={l.href}>
              <CoverLink
                href={l.href}
                card={l.card}
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
