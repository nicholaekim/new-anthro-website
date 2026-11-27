import { isSlot, slot, type Text } from "@/content/slot";
import type { ending, opening } from "@/content/pages";
import type { Chapter, ConfidenceLevel, Item, PersonCard, Provenance } from "@/content/types";

// The content every component and page test runs against, built from slots only, so filling the
// live content files never changes what these tests see. Only src/content/content.test.ts reads
// the live content. Each call returns a fresh copy, safe to change in a test.

const provenance = (): Provenance => ({
  creator: slot("fixture creator"),
  title: slot("fixture title"),
  holder: slot("fixture holder"),
  reference: slot("fixture reference"),
  rights: slot("fixture rights"),
  alterations: slot("fixture alterations"),
});

export function fixtureItem(id: string, kind: Item["kind"] = "document"): Item {
  return {
    id,
    kind,
    status: "sourced",
    image: null,
    alt: slot("fixture alt"),
    longDescription: slot("fixture description"),
    transcription: kind === "document" ? slot("fixture transcription") : null,
    translation: null,
    provenance: provenance(),
    contentNote: null,
    annotations: kind === "document" ? [{ id: `${id}-annotation-1`, text: slot("fixture annotation") }] : [],
    gapNote: null,
  };
}

const basis = () => ({
  quote: slot("fixture quote"),
  quoteTranslation: null,
  citation: slot("fixture citation"),
  explanation: slot("fixture explanation"),
  cardFactsUsed: [] as string[],
});

const outcome = (level: ConfidenceLevel) => ({
  text: slot("fixture outcome"),
  confidence: slot("fixture confidence"),
  level,
  citation: slot("fixture citation"),
});

// A chapter with all eight beats: item 1 and the instrument are beat 6's pair, neither has an image.
export function fixtureChapter(
  n = 1,
  { withOutcome = true, showPersonCard = true }: { withOutcome?: boolean; showPersonCard?: boolean } = {},
): Chapter {
  const slug = `fixture-${n}`;
  return {
    slug,
    place: `Fixture place ${n}`,
    country: `Fixture country ${n}`,
    historicalYear: 1900 + n,
    presentYear: 2020,
    showPersonCard,
    // Plain strings, not slots: the summaries are not shown by every page that counts slots.
    summary: {
      historical: { decides: `fixture ${n} historical decides`, evidence: `fixture ${n} historical evidence` },
      present: { decides: `fixture ${n} present decides`, evidence: `fixture ${n} present evidence` },
    },
    contentNote: slot("fixture chapter content note"),
    photograph: fixtureItem(`${slug}-photograph`, "photograph"),
    photographContext: slot("fixture context"),
    items: [fixtureItem(`${slug}-item-1`), fixtureItem(`${slug}-item-2`)],
    basis: basis(),
    outcome: withOutcome ? outcome("high") : null,
    changeOfDate: { historicalItemId: `${slug}-item-1`, presentItemId: `${slug}-instrument` },
    present: {
      instrument: fixtureItem(`${slug}-instrument`),
      basis: basis(),
      outcome: withOutcome ? outcome("low") : null,
      reflection: slot("fixture reflection"),
    },
  };
}

export function fixturePerson(): PersonCard {
  return {
    facts: [1, 2, 3, 4].map((n) => ({
      id: `fact-${n}`,
      label: slot(`fixture fact ${n} label`),
      value: slot(`fixture fact ${n} value`),
      reason: slot(`fixture fact ${n} reason`),
    })),
    fictionStatement: slot("fixture fiction statement"),
  };
}

// Four chapters; the last has no outcome and no person card, as a chapter may.
export function fixtureChapters(): Chapter[] {
  return [
    fixtureChapter(1),
    fixtureChapter(2),
    fixtureChapter(3),
    fixtureChapter(4, { withOutcome: false, showPersonCard: false }),
  ];
}

// Stands in for "@/content" in vi.mock.
export function fixtureContent() {
  const chapters = fixtureChapters();
  return {
    chapters,
    person: fixturePerson(),
    getChapter: (slug: string) => chapters.find((c) => c.slug === slug),
  };
}

// Stands in for "@/content/pages" in vi.mock.
export function fixturePages(): { opening: typeof opening; ending: typeof ending } {
  return {
    opening: { title: slot("fixture title"), framing: slot("fixture framing"), siteNote: slot("fixture site note") },
    ending: {
      comparability: slot("fixture comparability"),
      reflection: slot("fixture reflection"),
      methodNote: slot("fixture method note"),
      languageNote: slot("fixture language note"),
      bibliography: slot("fixture bibliography"),
      imageCredits: slot("fixture image credits"),
      fictionStatement: slot("fixture fiction statement"),
      aiUse: slot("fixture AI use"),
    },
  };
}

export function countSlots(value: unknown): number {
  if (Array.isArray(value)) return value.reduce((n: number, v) => n + countSlots(v), 0);
  if (value !== null && typeof value === "object") {
    if (isSlot(value as Text)) return 1;
    return Object.values(value).reduce((n: number, v) => n + countSlots(v), 0);
  }
  return 0;
}
