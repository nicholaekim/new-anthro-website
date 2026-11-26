import type { Text } from "./slot";

export type Era = "historical" | "present";
export type Status = "sourced" | "reconstructed" | "fictional";

export interface ImageRef {
  src: string;
  width: number;
  height: number;
  largeSrc?: string;
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
  provenance: Provenance;
  contentNote: Text | null;
  annotations: Annotation[];
  gapNote: Text | null;
}

export interface Basis {
  quote: Text;
  citation: Text;
  explanation: Text;
  cardFactsUsed: string[];
}

export interface Outcome {
  text: Text;
  confidence: Text;
  citation: Text;
}

export interface Chapter {
  slug: string;
  place: string;
  country: string;
  historicalYear: number;
  presentYear: 2020;
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
