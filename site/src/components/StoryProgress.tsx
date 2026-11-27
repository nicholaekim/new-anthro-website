"use client";

import { createContext, use, useEffect, useRef, useState, type ReactNode } from "react";
import type { Era } from "@/content/types";
import { activeIndex, progressBetween } from "./story";

// Where the reader is in a chapter: the active section (beat) and the progress through the
// chapter, 0 to 1. Measured on scroll and resize at every width and in both modes: this is
// feedback, not decoration. The provider renders the chapter's root ([data-chapter]) and sets
// data-active-beat on it once a section is known; without scripts neither exists. Beat 6's
// comparison reports the era it shows (useSetEraInView); the provider passes it to the person
// card and sets data-era-in-view on the root while that comparison is set up.

// The reading line, as a share of the view's height from its top: a section is active once its
// top has passed it.
const READING_LINE = 0.4;

type Listener = () => void;

function progressStore() {
  let value = 0;
  const listeners = new Set<Listener>();
  return {
    get: () => value,
    set(next: number) {
      if (next === value) return;
      value = next;
      listeners.forEach((l) => l());
    },
    subscribe(l: Listener) {
      listeners.add(l);
      return () => {
        listeners.delete(l);
      };
    },
  };
}

type ProgressStore = ReturnType<typeof progressStore>;

const StoryContext = createContext<{
  beats: readonly number[];
  activeBeat: number | null;
  eraInView: Era | null;
  setEraInView: (era: Era | null) => void;
  progress: ProgressStore;
} | null>(null);

export function StoryProgressProvider({
  slug,
  beats,
  className,
  children,
}: {
  slug: string;
  beats: readonly number[];
  className?: string;
  children: ReactNode;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [activeBeat, setActiveBeat] = useState<number | null>(null);
  const [eraInView, setEraInView] = useState<Era | null>(null);
  const [progress] = useState(progressStore);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const sections = [...el.querySelectorAll<HTMLElement>("section[data-beat]")];
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      // At the very bottom the last section is active even if its top cannot reach the line.
      const atEnd = scrollable > 0 && window.scrollY >= scrollable - 2;
      const tops = sections.map((s) => s.getBoundingClientRect().top);
      const i = atEnd ? sections.length - 1 : activeIndex(tops, window.innerHeight * READING_LINE);
      setActiveBeat(i < 0 ? null : Number(sections[i].dataset.beat));
      const start = el.getBoundingClientRect().top + window.scrollY;
      progress.set(progressBetween(window.scrollY, start, start + el.offsetHeight - window.innerHeight));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // The page's height changes as pins are set up and disclosures open.
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
    observer?.observe(el);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer?.disconnect();
    };
  }, [progress]);

  return (
    <StoryContext value={{ beats, activeBeat, eraInView, setEraInView, progress }}>
      <div
        ref={root}
        data-chapter={slug}
        data-active-beat={activeBeat ?? undefined}
        data-era-in-view={eraInView ?? undefined}
        className={className}
      >
        {children}
      </div>
    </StoryContext>
  );
}

// The chapter's sections, the active one, and the era beat 6 shows (null until its comparison is
// set up). Outside a chapter (the opening page) there is none.
export function useActiveBeat(): { beats: readonly number[]; activeBeat: number | null; eraInView: Era | null } {
  const story = use(StoryContext);
  return { beats: story?.beats ?? [], activeBeat: story?.activeBeat ?? null, eraInView: story?.eraInView ?? null };
}

const noEra = () => {};

// For beat 6's comparison: report the era in view, or null once it is no longer set up.
export function useSetEraInView(): (era: Era | null) => void {
  return use(StoryContext)?.setEraInView ?? noEra;
}

// Calls onChange with each new progress value without re-rendering: for a transform that
// follows the scroll directly. Nothing is called while progress stays at its starting 0.
export function useChapterProgressEffect(onChange: (progress: number) => void) {
  const store = use(StoryContext)?.progress;
  const latest = useRef(onChange);
  useEffect(() => {
    latest.current = onChange;
  });
  useEffect(() => store?.subscribe(() => latest.current(store.get())), [store]);
}
