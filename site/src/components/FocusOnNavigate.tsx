"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// After a route change, close the menu and move focus to the new page's h1.
// Preserved routes stay in the DOM hidden, so only a visible h1 counts.
export function FocusOnNavigate() {
  const pathname = usePathname();
  const previous = useRef(pathname);

  useEffect(() => {
    if (previous.current === pathname) return;
    previous.current = pathname;
    document.querySelector("details[data-nav-menu]")?.removeAttribute("open");
    const heading = [...document.querySelectorAll<HTMLElement>("h1")].find((h) => h.checkVisibility());
    if (!heading) return;
    if (!heading.hasAttribute("tabindex")) heading.setAttribute("tabindex", "-1");
    heading.focus();
  }, [pathname]);

  return null;
}
