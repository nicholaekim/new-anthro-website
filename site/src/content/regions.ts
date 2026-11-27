// Highlights on document images: where on the page a quoted passage sits.
// region is in fractions of the image (0 to 1), measured on the real file and checked by cropping.
export interface Highlight {
  id: string;
  label: string;
  region: { x: number; y: number; w: number; h: number };
  annotationIds: string[];
}

// Keyed by item id. An item with no entry has no highlights.
export const highlights: Record<string, Highlight[]> = {};
