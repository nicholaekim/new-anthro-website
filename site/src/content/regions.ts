// Highlights on document images: where on the page a quoted passage sits.
// region is in fractions of the image (0 to 1), measured on the real file and checked by cropping.
export interface Highlight {
  id: string;
  label: string;
  region: { x: number; y: number; w: number; h: number };
  annotationIds: string[];
}

// Keyed by item id. An item with no entry has no highlights.
// Pixel rectangles below are left, top, right, bottom (right and bottom exclusive).
export const highlights: Record<string, Highlight[]> = {
  // louisiana-item-1.jpg, 1600 x 1223 px. Left page (printed page 26).
  // highlight-1: 246,259 to 772,360. highlight-2: 246,360 to 772,501. highlight-3: 256,858 to 782,941.
  "louisiana-item-1": [
    {
      id: "louisiana-item-1-highlight-1",
      label: "Paragraph 150",
      region: { x: 0.1537, y: 0.2118, w: 0.3287, h: 0.0826 },
      annotationIds: ["louisiana-item-1-annotation-1"],
    },
    {
      id: "louisiana-item-1-highlight-2",
      label: "Paragraph 151",
      region: { x: 0.1537, y: 0.2944, w: 0.3287, h: 0.1153 },
      annotationIds: ["louisiana-item-1-annotation-1", "louisiana-item-1-annotation-2"],
    },
    {
      id: "louisiana-item-1-highlight-3",
      label: "Paragraph 155",
      region: { x: 0.16, y: 0.7016, w: 0.3287, h: 0.0679 },
      annotationIds: [],
    },
  ],
  // louisiana-item-2.jpg, 1600 x 2216 px. The quoted passage runs from the foot of the left
  // column into the top of the right column, so it has one rectangle per column.
  // highlight-1: 104,1383 to 755,1945. highlight-2: 766,291 to 1414,515.
  "louisiana-item-2": [
    {
      id: "louisiana-item-2-highlight-1",
      label: "Column headed 305",
      region: { x: 0.065, y: 0.6241, w: 0.4069, h: 0.2536 },
      annotationIds: ["louisiana-item-2-annotation-2"],
    },
    {
      id: "louisiana-item-2-highlight-2",
      label: "Column headed 306",
      region: { x: 0.4788, y: 0.1313, w: 0.405, h: 0.1011 },
      annotationIds: ["louisiana-item-2-annotation-1"],
    },
  ],
  // louisiana-present-instrument.jpg, 1600 x 1956 px. Whole of Question 9, through the
  // "Some other race" write-in boxes. highlight-1: 780,226 to 1478,1201.
  "louisiana-present-instrument": [
    {
      id: "louisiana-present-instrument-highlight-1",
      label: "Question 9",
      region: { x: 0.4875, y: 0.1155, w: 0.4363, h: 0.4985 },
      annotationIds: ["louisiana-present-instrument-annotation-1"],
    },
  ],
  // sao-paulo-item-1.jpg, 1600 x 2552 px (printed page 28). Section 10.7, also transcribed,
  // is on printed page 11 and is not on this image, so it has no highlight.
  // highlight-1: 200,415 to 1476,762.
  "sao-paulo-item-1": [
    {
      id: "sao-paulo-item-1-highlight-1",
      label: "Quesito 8",
      region: { x: 0.125, y: 0.1626, w: 0.7975, h: 0.136 },
      annotationIds: ["sao-paulo-item-1-annotation-2"],
    },
  ],
  // sao-paulo-item-2.jpg, 1600 x 2443 px (PDF page 8). Item 4, also transcribed, is on the
  // cover and is not on this image, so it has no highlight. highlight-1: 160,530 to 1072,905.
  "sao-paulo-item-2": [
    {
      id: "sao-paulo-item-2-highlight-1",
      label: "Quesito 8",
      region: { x: 0.1, y: 0.2169, w: 0.57, h: 0.1535 },
      annotationIds: ["sao-paulo-item-2-annotation-2"],
    },
  ],
  // sao-paulo-present-instrument.jpg, 1600 x 2263 px. Heading 10.10 through the foot of the
  // options table; the note box below the table is not included. highlight-1: 220,568 to 1456,1545.
  "sao-paulo-present-instrument": [
    {
      id: "sao-paulo-present-instrument-highlight-1",
      label: "Section 10.10",
      region: { x: 0.1375, y: 0.251, w: 0.7725, h: 0.4317 },
      annotationIds: [],
    },
  ],
  // johannesburg-item-1.jpg, 1600 x 2451 px (printed page 277). The opening words of section 1
  // are on page 275 and are not on this image, so they have no highlight.
  // highlight-1: 212,380 to 1186,455. highlight-2: 212,1094 to 1186,1206. highlight-3: 212,1432 to 1186,1621.
  "johannesburg-item-1": [
    {
      id: "johannesburg-item-1-highlight-1",
      label: "Section 1(iii)",
      region: { x: 0.1325, y: 0.155, w: 0.6088, h: 0.0306 },
      annotationIds: ["johannesburg-item-1-annotation-1", "johannesburg-item-1-annotation-2"],
    },
    {
      id: "johannesburg-item-1-highlight-2",
      label: "Section 1(x)",
      region: { x: 0.1325, y: 0.4463, w: 0.6088, h: 0.0457 },
      annotationIds: ["johannesburg-item-1-annotation-1", "johannesburg-item-1-annotation-2"],
    },
    {
      id: "johannesburg-item-1-highlight-3",
      label: "Section 1(xv)",
      region: { x: 0.1325, y: 0.5843, w: 0.6088, h: 0.0771 },
      annotationIds: ["johannesburg-item-1-annotation-1", "johannesburg-item-1-annotation-2"],
    },
  ],
  // johannesburg-present-instrument.jpg, 1600 x 2265 px (gazette page 13).
  // highlight-1: 520,416 to 1092,495. highlight-2: 192,614 to 650,929. highlight-3: 664,760 to 1416,1077.
  // highlight-4: 192,1338 to 650,1712. highlight-5: 664,1614 to 1360,1656.
  "johannesburg-present-instrument": [
    {
      id: "johannesburg-present-instrument-highlight-1",
      label: "Declaration by Employee",
      region: { x: 0.325, y: 0.1837, w: 0.3575, h: 0.0349 },
      annotationIds: [],
    },
    {
      id: "johannesburg-present-instrument-highlight-2",
      label: "Purpose of this form",
      region: { x: 0.12, y: 0.2711, w: 0.2863, h: 0.1391 },
      annotationIds: [],
    },
    {
      id: "johannesburg-present-instrument-highlight-3",
      label: "Question 3",
      region: { x: 0.415, y: 0.3355, w: 0.47, h: 0.14 },
      annotationIds: ["johannesburg-present-instrument-annotation-1"],
    },
    {
      id: "johannesburg-present-instrument-highlight-4",
      label: "Please note: designated groups",
      region: { x: 0.12, y: 0.5907, w: 0.2863, h: 0.1651 },
      annotationIds: ["johannesburg-present-instrument-annotation-1"],
    },
    {
      id: "johannesburg-present-instrument-highlight-5",
      label: "Item 4",
      region: { x: 0.415, y: 0.7126, w: 0.435, h: 0.0185 },
      annotationIds: [],
    },
  ],
};
