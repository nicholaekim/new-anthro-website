"use client";

import { useEffect, useRef, type FocusEvent, type KeyboardEvent } from "react";

// A native disclosure used as a small menu (the site menu, the story bar's section list) closes
// on Escape, with focus back on its summary; when focus leaves it; and when the pointer goes down
// outside it, which catches the clicks that move no focus (Safari, and Firefox on macOS, do not
// focus a clicked button or the page). Spread the handlers on the details and pass it ref.
export function useDismiss() {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const onPointerDown = (e: Event) => {
      const el = ref.current;
      if (el?.open && e.target instanceof Node && !el.contains(e.target)) el.open = false;
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  function onKeyDown(e: KeyboardEvent<HTMLDetailsElement>) {
    if (e.key !== "Escape" || !e.currentTarget.open) return;
    e.currentTarget.open = false;
    e.currentTarget.querySelector("summary")?.focus();
  }

  function onBlur(e: FocusEvent<HTMLDetailsElement>) {
    if (!e.currentTarget.contains(e.relatedTarget)) e.currentTarget.open = false;
  }

  return { ref, onKeyDown, onBlur };
}
