import { describe, expect, it } from "vitest";
import {
  clampView,
  fitSize,
  fitWidthView,
  MAX_SCALE,
  MIN_SCALE,
  panBy,
  regionRect,
  resizeView,
  toScreen,
  viewForRegion,
  wholePage,
  zoomAt,
  type Region,
  type Size,
  type View,
} from "./transform";

// A tall scanned page in a wide viewport, and the box it is laid out at before any zoom.
const image: Size = { width: 1600, height: 2400 };
const viewport: Size = { width: 900, height: 600 };
const content = fitSize(image, viewport); // 400 by 600

const close = (a: number, b: number) => expect(a).toBeCloseTo(b, 6);

describe("fitSize", () => {
  it("contains the image in the viewport, keeping its proportions", () => {
    expect(content).toEqual({ width: 400, height: 600 });
    const wide = fitSize({ width: 2000, height: 1000 }, { width: 500, height: 800 });
    expect(wide).toEqual({ width: 500, height: 250 });
  });
});

describe("wholePage", () => {
  it("shows the whole page at scale 1, centred", () => {
    expect(wholePage(content, viewport)).toEqual({ scale: 1, x: 250, y: 0 });
  });
});

describe("clampView", () => {
  it("keeps the scale between the limits", () => {
    expect(clampView({ scale: 0.2, x: 0, y: 0 }, content, viewport).scale).toBe(MIN_SCALE);
    expect(clampView({ scale: 99, x: 0, y: 0 }, content, viewport).scale).toBe(MAX_SCALE);
  });

  it("centres an axis on which the page is smaller than the viewport", () => {
    // At scale 2 the page is 800 wide, still narrower than 900: centred across, free down.
    const v = clampView({ scale: 2, x: -500, y: -300 }, content, viewport);
    expect(v.x).toBe(50);
    expect(v.y).toBe(-300);
  });

  it("never lets the page leave the viewport when it is larger than it", () => {
    // At scale 4 the page is 1600 by 2400.
    expect(clampView({ scale: 4, x: 100, y: 100 }, content, viewport)).toEqual({ scale: 4, x: 0, y: 0 });
    expect(clampView({ scale: 4, x: -5000, y: -5000 }, content, viewport)).toEqual({ scale: 4, x: 900 - 1600, y: 600 - 2400 });
  });
});

describe("zoomAt", () => {
  it("keeps the point under the pointer still while zooming", () => {
    const start: View = { scale: 2, x: 50, y: -300 };
    const point = { x: 300, y: 200 };
    // The page point under the pointer, before and after.
    const before = { x: (point.x - start.x) / start.scale, y: (point.y - start.y) / start.scale };
    const v = zoomAt(start, 1.5, point, content, viewport);
    expect(v.scale).toBe(3);
    close((point.x - v.x) / v.scale, before.x);
    close((point.y - v.y) / v.scale, before.y);
  });

  it("zooms out to no less than the whole page, centred", () => {
    const v = zoomAt({ scale: 2, x: 50, y: -300 }, 0.1, { x: 10, y: 10 }, content, viewport);
    expect(v).toEqual(wholePage(content, viewport));
  });

  it("stops at the largest scale", () => {
    const v = zoomAt({ scale: 7, x: -1000, y: -1000 }, 4, { x: 450, y: 300 }, content, viewport);
    expect(v.scale).toBe(MAX_SCALE);
  });
});

describe("panBy", () => {
  it("moves the page by the distance dragged, within the clamp", () => {
    const start = { scale: 4, x: -300, y: -600 };
    expect(panBy(start, 40, -60, content, viewport)).toEqual({ scale: 4, x: -260, y: -660 });
    expect(panBy(start, 10_000, 10_000, content, viewport)).toEqual({ scale: 4, x: 0, y: 0 });
  });
});

describe("fitWidthView", () => {
  it("fills the viewport's width and starts at the top of the page", () => {
    expect(fitWidthView(content, viewport)).toEqual({ scale: 900 / 400, x: 0, y: 0 });
  });

  it("is the whole page when the page is already as wide as the viewport", () => {
    const flat = fitSize({ width: 2000, height: 500 }, viewport); // 900 by 225
    expect(fitWidthView(flat, viewport)).toEqual(wholePage(flat, viewport));
  });
});

describe("viewForRegion", () => {
  const region: Region = { x: 0.15, y: 0.3, w: 0.33, h: 0.1 };

  it("centres the region in the viewport", () => {
    const v = viewForRegion(region, content, viewport);
    const r = regionRect(region, v, content);
    close(r.x + r.width / 2, viewport.width / 2);
    close(r.y + r.height / 2, viewport.height / 2);
  });

  it("makes the region as large as fits inside the margin, on its tighter axis", () => {
    const v = viewForRegion(region, content, viewport, 0.1);
    const r = regionRect(region, v, content);
    // The region is 132 by 60 at scale 1: its width limits it (720 / 132 < 480 / 60).
    close(r.width, 900 * 0.8);
    expect(r.height).toBeLessThanOrEqual(600 * 0.8 + 1e-9);
  });

  it("keeps a region near the page's edge on the page, inside the clamp", () => {
    const corner: Region = { x: 0, y: 0, w: 0.1, h: 0.05 };
    const v = viewForRegion(corner, content, viewport);
    expect(v).toEqual(clampView(v, content, viewport));
    const r = regionRect(corner, v, content);
    expect(r.x).toBeGreaterThanOrEqual(0);
    expect(r.y).toBeGreaterThanOrEqual(0);
  });

  it("shows a region larger than the view allows at the whole page", () => {
    const big: Region = { x: 0.05, y: 0.05, w: 0.9, h: 0.9 };
    expect(viewForRegion(big, content, viewport)).toEqual(wholePage(content, viewport));
  });

  it("does not zoom past the largest scale for a tiny region", () => {
    const tiny: Region = { x: 0.5, y: 0.5, w: 0.001, h: 0.001 };
    expect(viewForRegion(tiny, content, viewport).scale).toBe(MAX_SCALE);
  });
});

describe("regionRect", () => {
  // The outline is drawn outside the transformed page, from this rectangle; the page is drawn
  // with the CSS transform translate(x, y) scale(s) about its top left. The two must agree.
  const region: Region = { x: 0.1325, y: 0.5843, w: 0.6088, h: 0.0771 };
  const views: View[] = [
    wholePage(content, viewport),
    { scale: 3, x: -120, y: -700 },
    zoomAt({ scale: 2, x: 50, y: -300 }, 2.7, { x: 611, y: 83 }, content, viewport),
    panBy(viewForRegion(region, content, viewport), -37, 52, content, viewport),
  ];

  it.each(views)("puts the outline on the corners of the region as the transform draws them (%o)", (v) => {
    const r = regionRect(region, v, content);
    const topLeft = toScreen(v, { x: region.x * content.width, y: region.y * content.height });
    const bottomRight = toScreen(v, {
      x: (region.x + region.w) * content.width,
      y: (region.y + region.h) * content.height,
    });
    close(r.x, topLeft.x);
    close(r.y, topLeft.y);
    close(r.x + r.width, bottomRight.x);
    close(r.y + r.height, bottomRight.y);
  });

  it("matches the transform written as a matrix", () => {
    const v: View = { scale: 2.5, x: -40, y: -90 };
    // translate(x, y) scale(s) is the matrix (s, 0, 0, s, x, y): a point p goes to s * p + t.
    const p = { x: 123, y: 456 };
    expect(toScreen(v, p)).toEqual({ x: 2.5 * 123 - 40, y: 2.5 * 456 - 90 });
  });
});

describe("resizeView", () => {
  it("keeps the scale and the page point at the viewport's centre when the viewport changes", () => {
    const start: View = { scale: 3, x: -200, y: -500 };
    const centre = { x: (450 - start.x) / (content.width * start.scale), y: (300 - start.y) / (content.height * start.scale) };
    const nextViewport = { width: 600, height: 800 };
    const nextContent = fitSize(image, nextViewport);
    const v = resizeView(start, content, viewport, nextContent, nextViewport);
    expect(v.scale).toBe(3);
    close((300 - v.x) / (nextContent.width * v.scale), centre.x);
    close((400 - v.y) / (nextContent.height * v.scale), centre.y);
  });

  it("shows the whole page again when it was showing the whole page", () => {
    const nextViewport = { width: 375, height: 500 };
    const nextContent = fitSize(image, nextViewport);
    expect(resizeView(wholePage(content, viewport), content, viewport, nextContent, nextViewport)).toEqual(
      wholePage(nextContent, nextViewport),
    );
  });
});
