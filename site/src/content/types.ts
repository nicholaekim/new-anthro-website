import type { Text } from "./slot";

export type Era = "historical" | "present";
export type Status = "sourced" | "reconstructed" | "fictional";
// The four confidence levels, most determinable first: the one list the type, the validator and
// the meter's legend read.
export const CONFIDENCE_LEVELS = ["high", "moderate", "low", "undetermined"] as const;
export type ConfidenceLevel = (typeof CONFIDENCE_LEVELS)[number];

// A short structured summary of one era's rule: who applies it, and on what evidence.
export interface EraSummary {
  decides: Text;
  evidence: Text;
}

export interface ImageRef {
  src: string;
  width: number;
  height: number;
}

export interface Provenance {
  creator: Text;
  title: Text;
  holder: Text;
  reference: Text;
  rights: Text;
  alterations: Text;
}

export interface Annotation {
  id: string;
  text: Text;
}

export interface Item {
  id: string;
  kind: "document" | "photograph";
  status: Status;
  image: ImageRef | null;
  alt: Text;
  longDescription: Text;
  transcription: Text | null;
  // An English translation of the transcription, where the source is not in English.
  translation: Text | null;
  // The language of the transcription where it is not English, as a BCP 47 tag ("pt"), so the
  // original is read in its own language. Structural, not wording.
  originalLang?: string;
  provenance: Provenance;
  contentNote: Text | null;
  annotations: Annotation[];
  gapNote: Text | null;
}

export interface Basis {
  quote: Text;
  // An English translation of the quotation, where the source is not in English.
  quoteTranslation: Text | null;
  // The language of the quotation where it is not English ("pt"), as for an item.
  originalLang?: string;
  citation: Text;
  explanation: Text;
  cardFactsUsed: string[];
}

export interface Outcome {
  text: Text;
  confidence: Text;
  level: ConfidenceLevel;
  citation: Text;
}

export interface Chapter {
  slug: string;
  place: string;
  country: string;
  historicalYear: number;
  presentYear: 2020;
  // Whether the chapter page shows the person card. When false, no basis may list card facts.
  showPersonCard: boolean;
  summary: { historical: EraSummary; present: EraSummary };
  contentNote: Text;
  photograph: Item;
  photographContext: Text;
  items: Item[];
  basis: Basis | null;
  outcome: Outcome | null;
  changeOfDate: { historicalItemId: string; presentItemId: string } | null;
  present: {
    instrument: Item | null;
    basis: Basis | null;
    outcome: Outcome | null;
    reflection: Text;
  };
}

export interface PersonFact {
  id: string;
  label: Text;
  value: Text;
  reason: Text;
}

export interface PersonCard {
  facts: PersonFact[];
  fictionStatement: Text;
}
