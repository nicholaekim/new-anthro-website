"use client";

import Image from "next/image";
import { useEffect, useEffectEvent, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { Highlight } from "@/content/regions";
import type { ImageRef } from "@/content/types";
import { gsap, HOUSE_EASE, useGSAP } from "@/motion/gsap";
import { useMotionMode } from "@/motion/MotionProvider";
import {
  fitSize,
  fitWidthView,
  panBy,
  regionRect,
  resizeView,
  viewForRegion,
  wholePage,
  zoomAt,
  type Point,
  type Size,
  type View,
} from "./transform";

interface Layout {
  viewport: Size;
  content: Size;
  view: View;
}

// One step of the zoom buttons and the plus and minus keys; one arrow-key step, as a share of
// the viewport; how far a pointer moves before a press becomes a drag, in pixels.
const ZOOM_STEP = 1.25;
const PAN_STEP = 0.1;
const DRAG_THRESHOLD = 4;

// A request from the panel to show a highlight; seq makes choosing the same one again count.
export interface ZoomRequest {
  id: string;
  seq: number;
}

// The zoomable page. The image is laid out at its fitted size in the top left of the viewport and
// drawn with translate and scale (transform.ts). The outlines are not inside that transform: each
// is placed from the same view by regionRect, so it sits on its region at every scale and keeps a
// thin, even line. Gestures and keys move the view at once; in full motion Reset, Fit width and a
// chosen highlight glide there.
export function ViewerStage({
  image,
  src,
  alt,
  highlights,
  selectedId,
  request,
  showOutlines,
  onChoose,
}: {
  image: ImageRef;
  src: string;
  alt: string;
  highlights: Highlight[];
  selectedId: string | null;
  request: ZoomRequest | null;
  showOutlines: boolean;
  onChoose: (id: string) => void;
}) {
  const { mode } = useMotionMode();
  const viewportRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<Layout | null>(null);
  const layoutRef = useRef<Layout | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const [zoomMessage, setZoomMessage] = useState("");
  const instructionsId = useId();

  useEffect(() => {
    layoutRef.current = layout;
  }, [layout]);

  // Measure the viewport, and keep the view sensible when it changes size.
  useLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const measure = () => {
      const viewport = { width: el.clientWidth, height: el.clientHeight };
      if (viewport.width === 0 || viewport.height === 0) return;
      const content = fitSize(image, viewport);
      setLayout((prev) => {
        if (prev && prev.viewport.width === viewport.width && prev.viewport.height === viewport.height) return prev;
        const view = prev ? resizeView(prev.view, prev.content, prev.viewport, content, viewport) : wholePage(content, viewport);
        return { viewport, content, view };
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [image]);

  const stopTween = () => {
    tweenRef.current?.kill();
    tweenRef.current = null;
  };

  // In full motion only: a glide from one view to another. It tweens a plain object, never an
  // element, so nothing is left inline; it is killed on a mode change and on unmount.
  const glide = useRef<((from: View, to: View) => void) | null>(null);
  useGSAP(
    (context) => {
      if (mode !== "full") return;
      glide.current = context.add("glide", (from: View, to: View) => {
        const proxy = { ...from };
        tweenRef.current = gsap.to(proxy, {
          ...to,
          duration: 0.6,
          ease: HOUSE_EASE,
          onUpdate: () => setLayout((cur) => cur && { ...cur, view: { ...proxy } }),
        });
      }) as (from: View, to: View) => void;
      return () => {
        stopTween();
        glide.current = null;
      };
    },
    { dependencies: [mode], revertOnUpdate: true },
  );

  // Set the view at once (gestures, keys, the zoom buttons).
  const update = (next: (l: Layout) => View) => {
    stopTween();
    setLayout((l) => l && { ...l, view: next(l) });
  };

  // Go to a view chosen through a control (Reset, Fit width, a highlight): glides in full motion,
  // instant in still.
  const moveTo = (next: (l: Layout) => View) => {
    const l = layoutRef.current;
    if (!l) return;
    stopTween();
    if (glide.current) glide.current(l.view, next(l));
    else setLayout((cur) => cur && { ...cur, view: next(cur) });
  };

  // A highlight chosen in the panel or on the page: centre and zoom to it, once the viewport is known.
  const handled = useRef(0);
  const measured = layout !== null;
  const showRegion = useEffectEvent((h: Highlight) => moveTo((l) => viewForRegion(h.region, l.content, l.viewport)));
  useEffect(() => {
    if (!request || !measured || handled.current === request.seq) return;
    const h = highlights.find((x) => x.id === request.id);
    if (!h) return;
    handled.current = request.seq;
    showRegion(h);
  }, [request, measured, highlights]);

  // Wheel and trackpad zoom about the pointer. Not a React listener: those are passive, and the
  // page behind must not scroll.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? el.clientHeight : 1;
      // A trackpad pinch arrives as a wheel with ctrlKey and small deltas.
      const factor = Math.exp(-e.deltaY * unit * (e.ctrlKey ? 0.01 : 0.002));
      const box = el.getBoundingClientRect();
      const point = { x: e.clientX - box.left, y: e.clientY - box.top };
      update((l) => zoomAt(l.view, factor, point, l.content, l.viewport));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  });

  // Drag with one pointer, pinch with two. A press that does not move stays a click on whatever
  // it landed on (a highlight's outline); once it moves the viewport captures it, so the click
  // that follows a drag lands on the viewport, not on an outline.
  const pointers = useRef(new Map<number, Point>());
  const dragging = useRef(false);
  const local = (e: PointerEvent) => {
    const box = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - box.left, y: e.clientY - box.top };
  };
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    stopTween();
    pointers.current.set(e.pointerId, local(e));
    if (pointers.current.size === 1) dragging.current = false;
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    const p = local(e);
    if (pointers.current.size === 1) {
      if (!dragging.current && Math.hypot(p.x - prev.x, p.y - prev.y) < DRAG_THRESHOLD) return;
      if (!dragging.current) {
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
      }
      pointers.current.set(e.pointerId, p);
      update((l) => panBy(l.view, p.x - prev.x, p.y - prev.y, l.content, l.viewport));
      return;
    }
    // Two pointers: zoom about their midpoint by the change in their distance, and follow the midpoint.
    const [a, b] = [...pointers.current.entries()].map(([id, q]) => (id === e.pointerId ? p : q));
    const [a0, b0] = [...pointers.current.values()];
    pointers.current.set(e.pointerId, p);
    dragging.current = true;
    const before = { x: (a0.x + b0.x) / 2, y: (a0.y + b0.y) / 2 };
    const after = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    const d0 = Math.hypot(a0.x - b0.x, a0.y - b0.y);
    const d1 = Math.hypot(a.x - b.x, a.y - b.y);
    if (d0 === 0) return;
    update((l) => {
      const zoomed = zoomAt(l.view, d1 / d0, before, l.content, l.viewport);
      return panBy(zoomed, after.x - before.x, after.y - before.y, l.content, l.viewport);
    });
  };
  const onPointerEnd = (e: PointerEvent<HTMLDivElement>) => {
    pointers.current.delete(e.pointerId);
  };

  const announceZoom = (l: Layout | null) => {
    if (l) setZoomMessage(`Zoom ${Math.round(l.view.scale * 100)} percent`);
  };
  const zoomBy = (factor: number) => {
    const l = layoutRef.current;
    if (!l) return;
    const centre = { x: l.viewport.width / 2, y: l.viewport.height / 2 };
    const view = zoomAt(l.view, factor, centre, l.content, l.viewport);
    update(() => view);
    announceZoom({ ...l, view });
  };

  // Keys only while the image area itself has focus; an outline inside it keeps its own keys.
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget || e.altKey || e.ctrlKey || e.metaKey) return;
    const l = layoutRef.current;
    if (!l) return;
    const step = { x: l.viewport.width * PAN_STEP, y: l.viewport.height * PAN_STEP };
    const pans: Record<string, [number, number]> = {
      ArrowLeft: [step.x, 0],
      ArrowRight: [-step.x, 0],
      ArrowUp: [0, step.y],
      ArrowDown: [0, -step.y],
    };
    if (e.key in pans) {
      const [dx, dy] = pans[e.key];
      update((cur) => panBy(cur.view, dx, dy, cur.content, cur.viewport));
    } else if (e.key === "+" || e.key === "=") {
      zoomBy(ZOOM_STEP);
    } else if (e.key === "-" || e.key === "_") {
      zoomBy(1 / ZOOM_STEP);
    } else {
      return;
    }
    e.preventDefault();
  };

  const view = layout?.view;
  const content = layout?.content;
  const percent = view ? Math.round(view.scale * 100) : 100;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      <div className="-mx-2 flex flex-wrap items-center gap-x-1 gap-y-1">
        <button type="button" onClick={() => zoomBy(ZOOM_STEP)} className="target quiet px-2 text-sm">
          Zoom in
        </button>
        <button type="button" onClick={() => zoomBy(1 / ZOOM_STEP)} className="target quiet px-2 text-sm">
          Zoom out
        </button>
        <button
          type="button"
          onClick={() => moveTo((l) => fitWidthView(l.content, l.viewport))}
          className="target quiet px-2 text-sm"
        >
          Fit width
        </button>
        <button
          type="button"
          onClick={() => moveTo((l) => wholePage(l.content, l.viewport))}
          className="target quiet px-2 text-sm"
        >
          Reset<span className="sr-only"> to the whole page</span>
        </button>
        <span aria-hidden className="soft px-2 font-interface text-sm tabular-nums">
          {percent}%
        </span>
        <span aria-live="polite" className="sr-only">
          {zoomMessage}
        </span>
      </div>
      <div
        ref={viewportRef}
        data-viewer-viewport
        role="group"
        aria-label="Page image"
        aria-describedby={instructionsId}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        className="relative min-h-0 flex-1 cursor-grab touch-none overflow-hidden border border-(--hair) bg-paper-deep select-none active:cursor-grabbing"
      >
        <div
          data-viewer-page
          className={`absolute top-0 left-0 origin-top-left ${layout ? "" : "invisible"}`}
          style={
            view && content
              ? {
                  width: content.width,
                  height: content.height,
                  transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`,
                }
              : undefined
          }
        >
          <Image
            src={src}
            width={image.width}
            height={image.height}
            alt={alt}
            unoptimized
            loading="eager"
            draggable={false}
            className="block h-full w-full"
          />
        </div>
        {showOutlines &&
          view &&
          content &&
          highlights.map((h, i) => {
            const r = regionRect(h.region, view, content);
            const selected = h.id === selectedId;
            return (
              <button
                key={h.id}
                type="button"
                data-highlight={h.id}
                aria-label={h.label}
                aria-current={selected ? "true" : undefined}
                onClick={(e) => {
                  // detail 0: chosen from the keyboard, whatever the pointer did before.
                  if (e.detail === 0 || !dragging.current) onChoose(h.id);
                }}
                className="viewer-outline absolute"
                style={{ left: r.x, top: r.y, width: r.width, height: r.height }}
              >
                <span aria-hidden data-outline-line />
                <span aria-hidden data-outline-number>
                  {i + 1}
                </span>
              </button>
            );
          })}
      </div>
      <p id={instructionsId} className="soft font-interface text-xs leading-snug">
        Drag to move the page; scroll, pinch or use the buttons to zoom. With the image selected, the
        arrow keys move it and plus and minus zoom.
      </p>
    </div>
  );
}
