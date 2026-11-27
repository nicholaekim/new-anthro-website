"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, use, useEffect, useLayoutEffect, useReducer, useRef, useState, type ReactNode } from "react";
import { COVER_FAILSAFE_MS, coverReducer, shouldCover, type CoverState, type TitleCard } from "./cover";
import { coverHoldMs } from "./entrance";
import { DURATION, gsap, HOUSE_EASE, RISE, ScrollTrigger } from "./gsap";
import { useMotionMode } from "./MotionProvider";

// The open fade ends idle even if its tween never completes, so the cover can never stay up.
const OPEN_FAILSAFE_MS = 1500;

// Exported for tests that need a given cover state.
export const CoverContext = createContext<{ state: CoverState; start: (href: string, card?: TitleCard) => boolean }>({
  state: "idle",
  start: () => false,
});

export function useCover() {
  return use(CoverContext);
}

// Plays a dark panel over the page between an in-app link click and the new page.
// CoverLink calls start(href, card); in full motion, for another page, the cover fades in, the
// route is pushed, and once the pathname has changed (a frame later, after ScrollTrigger has
// measured the new page) it fades out. With a title card (the link's destination: chapter number,
// place and year, or "Ending", "Opening") the card rises in as the cover closes and stays at least
// DURATION.cardHold once it has closed, then fades away with the cover as the new page's title
// rises. The panel and its card are a sibling of the page content, never an ancestor; aria-hidden
// (the new page's h1 receives focus, as before: FocusOnNavigate), no transform on the panel, and
// not rendered when idle. Back, Forward and reload never pass through here: plain cuts.
export function CoverProvider({ children }: { children: ReactNode }) {
  const { mode } = useMotionMode();
  const router = useRouter();
  const pathname = usePathname();
  const [state, dispatch] = useReducer(coverReducer, "idle");
  const [card, setCard] = useState<TitleCard | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const cardEl = useRef<HTMLDivElement>(null);
  const busy = useRef(false); // set at once on start, so a second click in the same frame is not covered
  const target = useRef<{ href: string; from: string; pushed: boolean; closedAt: number | null } | null>(null);

  function start(href: string, next?: TitleCard): boolean {
    // A second link chosen while the cover is busy: before the first route is pushed the cover
    // goes to the second instead, with its card; after, the second navigates as a plain cut and
    // no card is shown, so the first link's title never stands over the second page.
    const t = target.current;
    if (busy.current && t) {
      if (t.pushed) {
        setCard(null);
        return false;
      }
      // A link back to the page the cover started from is ignored: the cover is already leaving it.
      if (shouldCover(mode, t.from, href)) {
        t.href = href;
        setCard(next ?? null);
      }
      return true;
    }
    if (busy.current || !shouldCover(mode, pathname, href)) return false;
    busy.current = true;
    target.current = { href, from: pathname, pushed: false, closedAt: null };
    setCard(next ?? null);
    dispatch("navigate");
    return true;
  }

  // The fades. Each is killed, never reverted, when the state moves on, so the panel keeps the
  // opacity it had reached.
  useLayoutEffect(() => {
    const el = panel.current;
    if (!el) return;
    if (state === "closing") {
      const tween = gsap.fromTo(
        el,
        { opacity: 0 },
        { opacity: 1, duration: DURATION.coverClose, ease: HOUSE_EASE, onComplete: () => dispatch("closed") },
      );
      return () => {
        tween.kill();
      };
    }
    if (state === "opening") {
      const tween = gsap.to(el, { opacity: 0, duration: DURATION.coverOpen, ease: HOUSE_EASE, onComplete: () => dispatch("opened") });
      const failsafe = setTimeout(() => dispatch("opened"), OPEN_FAILSAFE_MS);
      return () => {
        tween.kill();
        clearTimeout(failsafe);
      };
    }
  }, [state]);

  // The card rises in once, from the start of the close; it runs on past the close, so it is
  // killed only when the cover goes away (with the panel and everything written on it).
  const shown = state !== "idle";
  useLayoutEffect(() => {
    const el = cardEl.current;
    if (!shown || !el) return;
    const tween = gsap.fromTo(
      el,
      { opacity: 0, y: RISE },
      { opacity: 1, y: 0, duration: DURATION.part, delay: DURATION.coverClose / 2, ease: HOUSE_EASE },
    );
    return () => {
      tween.kill();
    };
  }, [shown]);

  // Covered: push the route once. When the pathname differs from where the cover started (the
  // pushed route, or Back pressed while closing), wait out the card's hold and a frame, measure,
  // and open.
  useEffect(() => {
    const t = target.current;
    if (state !== "covered" || !t) return;
    t.closedAt ??= performance.now();
    if (pathname === t.from) {
      if (!t.pushed) {
        t.pushed = true;
        router.push(t.href);
      }
      return;
    }
    let frame = 0;
    const hold = card ? coverHoldMs(t.closedAt, performance.now(), DURATION.cardHold * 1000) : 0;
    const timer = setTimeout(() => {
      frame = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        dispatch("arrived");
      });
    }, hold);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [state, pathname, router, card]);

  // One failsafe across closing and covered: if no new page has arrived, open anyway. If the
  // close never finished, the route was never pushed: push it now, as a plain cut, unless the
  // page has already changed (Back pressed while closing).
  const currentPath = useRef(pathname);
  useEffect(() => {
    currentPath.current = pathname;
  }, [pathname]);
  const waiting = state === "closing" || state === "covered";
  useEffect(() => {
    if (!waiting) return;
    const failsafe = setTimeout(() => {
      const t = target.current;
      if (t && !t.pushed && currentPath.current === t.from) {
        t.pushed = true;
        router.push(t.href);
      }
      dispatch("failsafe");
    }, COVER_FAILSAFE_MS);
    return () => clearTimeout(failsafe);
  }, [waiting, router]);

  useEffect(() => {
    if (state !== "idle") return;
    busy.current = false;
    target.current = null;
  }, [state]);

  return (
    <CoverContext value={{ state, start }}>
      {children}
      {shown && (
        <div ref={panel} data-cover aria-hidden="true" className="fixed inset-0 z-50 grid place-items-center bg-surround px-6 text-paper">
          {card && (
            <div ref={cardEl} data-cover-card className="flex flex-col items-center gap-4 text-center">
              {card.kicker && <p className="caps soft">{card.kicker}</p>}
              <p className="font-title type-display">{card.title}</p>
              {card.year !== null && <p className="font-title text-3xl font-light tabular-nums text-muted">{card.year}</p>}
            </div>
          )}
        </div>
      )}
    </CoverContext>
  );
}
