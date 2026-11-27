import type { ReactNode } from "react";
import type { Text } from "@/content/slot";
import { SlotText } from "./SlotText";

export type LanguagePart = "original" | "translation";

const LABELS: Record<LanguagePart, string> = { original: "Original", translation: "English translation" };

// A source's own words and, where it is not in English, the translation beside them: side by
// side when the space they sit in is wide enough, stacked otherwise (a container query, so a
// narrow panel stacks them on any screen). render draws each text in its caller's box; the
// original keeps the source voice there. Without a translation only the original is shown, as before.
// lang: the original's language where it is not English ("pt"), set on the original's text only,
// never on its English label.
export function Bilingual({
  original,
  translation,
  lang,
  render,
}: {
  original: Text;
  translation: Text | null;
  lang?: string;
  render: (text: ReactNode, part: LanguagePart) => ReactNode;
}) {
  const source = lang ? <span lang={lang}><SlotText value={original} /></span> : <SlotText value={original} />;
  if (translation === null) return render(source, "original");
  return (
    <div className="@container">
      <div className="grid gap-5 @lg:grid-cols-2 @lg:gap-6">
        {(["original", "translation"] as const).map((part) => (
          <div key={part} data-language-part={part} className="flex min-w-0 flex-col gap-1.5">
            <p className="caps soft">{LABELS[part]}</p>
            {render(part === "original" ? source : <SlotText value={translation} />, part)}
          </div>
        ))}
      </div>
    </div>
  );
}

// An item's transcription, in the page and in the close view: the original in the source voice
// on the transcription's deeper paper, the translation beside it in the site's own voice.
export function Transcription({ text, translation, lang }: { text: Text; translation: Text | null; lang?: string }) {
  return (
    <Bilingual
      original={text}
      translation={translation}
      lang={lang}
      render={(node, part) => (
        <div
          className={`${part === "original" ? "font-source type-source" : "font-yours text-base leading-[1.6]"} measure whitespace-pre-line border-l-2 border-ink/25 bg-paper-deep px-4 py-3 sm:px-5 sm:py-4`}
        >
          {node}
        </div>
      )}
    />
  );
}
