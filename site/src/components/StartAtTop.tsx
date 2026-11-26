"use client";

import { useEffect, useLayoutEffect } from "react";
import { ScrollTrigger } from "@/motion/gsap";
import { useMotionMode } from "@/motion/MotionProvider";

// First child of a chapter page, so its layout effect runs before the beats' motion set-ups
// measure their pins: without a hash the page starts at the top on load, reload and Back.
// With a hash (#beat-N) the target is scrolled to again once the client motion set-up exists
// (ready). The pins' spacing is only applied by ScrollTrigger's next refresh, which keeps the
// scroll position it found, so refresh now (synchronous) and then scroll to the target
// (traced in Chrome: without the refresh the page stayed at the pre-pin position).
// The element the URL's hash names, or null when there is no hash, no such element, or the
// hash is malformed (decodeURIComponent throws on, for example, #%E0%A4%A).
function hashTarget(): HTMLElement | null {
  if (!location.hash) return null;
  try {
    return document.getElementById(decodeURIComponent(location.hash.slice(1)));
  } catch {
    return null;
  }
}

export function StartAtTop() {
  const { ready } = useMotionMode();

  useLayoutEffect(() => {
    if (!hashTarget()) window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!ready || !hashTarget()) return;
    ScrollTrigger.refresh();
    hashTarget()?.scrollIntoView();
  }, [ready]);

  return null;
}
