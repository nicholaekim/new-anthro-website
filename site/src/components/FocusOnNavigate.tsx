"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// Root client component in the layout. Scroll restoration is manual for the whole site, set once
// and never set back, so reload and Back never restore a remembered position (chapter pages start
// at the top: see StartAtTop). After a route change it closes the menu and moves focus to the new
// page's h1; only the current page is in the DOM, so the first h1 is the page's.
// What the address's hash names: the first heading inside that element, or the element itself
// when it holds none; null with no hash, no such element, or a malformed hash.
function hashTarget(): HTMLElement | null {
  if (!location.hash) return null;
  try {
    const el = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    return el?.querySelector<HTMLElement>("h1, h2, h3") ?? el;
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
    // heading takes focus; focusing the h1 would scroll back to the top of the page. The page is
    // already scrolled there (StartAtTop allows for the pins' spacing), so this focus must not
    // scroll again.
    const named = hashTarget();
    const target = named ?? document.querySelector<HTMLElement>("h1");
    if (!target) return;
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus(named ? { preventScroll: true } : undefined);
  }, [pathname]);

  return null;
}
