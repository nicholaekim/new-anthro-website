import { slot, type Text } from "./slot";

// The opening and ending pages' own text. Fill a slot by replacing slot('…') with a string.
export const opening: { title: Text; framing: Text; siteNote: Text } = {
  title: slot("your title"),
  framing: slot("your framing text"),
  siteNote: slot("your site-level note on language and content"),
};

export const ending: {
  comparability: Text;
  reflection: Text;
  methodNote: Text;
  languageNote: Text;
  bibliography: Text;
  imageCredits: Text;
  fictionStatement: Text;
  aiUse: Text;
} = {
  comparability: slot("your conclusion on whether and how the four cases can be compared"),
  reflection: slot("your reflection on what the site asked the visitor to do"),
  methodNote: slot("your method note"),
  languageNote: slot("your note on language"),
  bibliography: slot("your bibliography"),
  imageCredits: slot("your image credits"),
  fictionStatement: slot("your statement of what is fictional or reconstructed"),
  aiUse: slot("your AI-use disclosure"),
};
