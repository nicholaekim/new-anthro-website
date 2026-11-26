"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// Root client component in the layout. Scroll restoration is manual for the whole site, set once
// and never set back, so reload and Back never restore a remembered position (chapter pages start
// at the top: see StartAtTop). After a route change it closes the menu and moves focus to the new
// page's h1; only the current page is in the DOM, so the first h1 is the page's.
export function FocusOnNavigate() {
  const pathname = usePathname();
  const previous = useRef(pathname);

  useEffect(() => {
    history.scrollRestoration = "manual";
  }, []);

  useEffect(() => {
    if (previous.current === pathname) return;
    previous.current = pathname;
    document.querySelector("details[data-nav-menu]")?.removeAttribute("open");
    const heading = document.querySelector<HTMLElement>("h1");
    if (!heading) return;
    if (!heading.hasAttribute("tabindex")) heading.setAttribute("tabindex", "-1");
    heading.focus();
  }, [pathname]);

  return null;
}
