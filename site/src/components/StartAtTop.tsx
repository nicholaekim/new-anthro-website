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
export function StartAtTop() {
  const { ready } = useMotionMode();

  useLayoutEffect(() => {
    if (!location.hash) window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!ready || !location.hash) return;
    ScrollTrigger.refresh();
    document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();
  }, [ready]);

  return null;
}
