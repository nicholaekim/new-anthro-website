"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// Root client component in the layout. Scroll restoration is manual for the whole site, set once
// and never set back, so reload and Back never restore a remembered position (chapter pages start
// at the top: see StartAtTop). After a route change it closes the menu and moves focus to the new
// page's h1; only the current page is in the DOM, so the first h1 is the page's.
// The first heading inside the element the address's hash names, or null.
function sectionHeading(): HTMLElement | null {
  if (!location.hash) return null;
  try {
    return document.getElementById(decodeURIComponent(location.hash.slice(1)))?.querySelector<HTMLElement>("h1, h2, h3") ?? null;
  } catch {
    return null; // a malformed hash
  }
}

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
    // A link to a section (the ending's matrix: /chapters/…#beat-4) lands on that section, so its
    // heading takes focus; focusing the h1 would scroll back to the top of the page.
    const heading = sectionHeading() ?? document.querySelector<HTMLElement>("h1");
    if (!heading) return;
    if (!heading.hasAttribute("tabindex")) heading.setAttribute("tabindex", "-1");
    heading.focus();
  }, [pathname]);

  return null;
}
