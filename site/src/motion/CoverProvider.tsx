"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, use, useEffect, useLayoutEffect, useReducer, useRef, type ReactNode } from "react";
import { COVER_FAILSAFE_MS, coverReducer, shouldCover, type CoverState } from "./cover";
import { gsap, HOUSE_EASE, ScrollTrigger } from "./gsap";
import { useMotionMode } from "./MotionProvider";

const CLOSE_S = 0.4;
const OPEN_S = 0.5;
// The open fade ends idle even if its tween never completes, so the cover can never stay up.
const OPEN_FAILSAFE_MS = 1500;

const CoverContext = createContext<{ state: CoverState; start: (href: string) => boolean }>({
  state: "idle",
  start: () => false,
});

export function useCover() {
  return use(CoverContext);
}

// Plays a plain dark panel over the page between an in-app link click and the new page.
// CoverLink calls start(href); in full motion, for another page, the cover fades in, the route
// is pushed, and once the pathname has changed (a frame later, after ScrollTrigger has measured
// the new page) it fades out. The panel is a sibling of the page content, never an ancestor; it
// is aria-hidden, carries no transform, and is not rendered when idle. Back, Forward and reload
// never pass through here, so they stay plain cuts.
export function CoverProvider({ children }: { children: ReactNode }) {
  const { mode } = useMotionMode();
  const router = useRouter();
  const pathname = usePathname();
  const [state, dispatch] = useReducer(coverReducer, "idle");
  const panel = useRef<HTMLDivElement>(null);
  const busy = useRef(false); // set at once on start, so a second click in the same frame is not covered
  const target = useRef<{ href: string; from: string; pushed: boolean } | null>(null);

  function start(href: string): boolean {
    if (busy.current || !shouldCover(mode, pathname, href)) return false;
    busy.current = true;
    target.current = { href, from: pathname, pushed: false };
    dispatch("navigate");
    return true;
  }

  // The fades. Each is killed, never reverted, when the state moves on, so the panel keeps the
  // opacity it had reached.
  useLayoutEffect(() => {
    const el = panel.current;
    if (!el) return;
    if (state === "closing") {
      const tween = gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: CLOSE_S, ease: HOUSE_EASE, onComplete: () => dispatch("closed") });
      return () => {
        tween.kill();
      };
    }
    if (state === "opening") {
      const tween = gsap.to(el, { opacity: 0, duration: OPEN_S, ease: HOUSE_EASE, onComplete: () => dispatch("opened") });
      const failsafe = setTimeout(() => dispatch("opened"), OPEN_FAILSAFE_MS);
      return () => {
        tween.kill();
        clearTimeout(failsafe);
      };
    }
  }, [state]);

  // Covered: push the route once. When the pathname differs from where the cover started (the
  // pushed route, or Back pressed while closing), wait a frame, measure, and open.
  useEffect(() => {
    const t = target.current;
    if (state !== "covered" || !t) return;
    if (pathname === t.from) {
      if (!t.pushed) {
        t.pushed = true;
        router.push(t.href);
      }
      return;
    }
    const frame = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      dispatch("arrived");
    });
    return () => cancelAnimationFrame(frame);
  }, [state, pathname, router]);

  // One failsafe across closing and covered: if no new page has arrived, open anyway.
  const waiting = state === "closing" || state === "covered";
  useEffect(() => {
    if (!waiting) return;
    const failsafe = setTimeout(() => dispatch("failsafe"), COVER_FAILSAFE_MS);
    return () => clearTimeout(failsafe);
  }, [waiting]);

  useEffect(() => {
    if (state !== "idle") return;
    busy.current = false;
    target.current = null;
  }, [state]);

  return (
    <CoverContext value={{ state, start }}>
      {children}
      {state !== "idle" && <div ref={panel} data-cover aria-hidden="true" className="fixed inset-0 z-50 bg-surround" />}
    </CoverContext>
  );
}
