import type { Chapter, Era } from "@/content/types";
import { CoverLink } from "@/motion/CoverLink";
import type { TitleCard } from "@/motion/cover";
import { ConfidenceMeter } from "../ConfidenceMeter";
import { Disclosure } from "../Disclosure";
import { chapterTitleCard } from "../navLinks";
import { SlotText } from "../SlotText";
import { CONFIDENCE_LEVELS, CONFIDENCE_WORDS, NO_PERSON_PLACED, sectionTag } from "../story";
import { cellHref, matrixCell, MATRIX_VIEWS, type MatrixView } from "./matrix";
import { MatrixViews } from "./MatrixViews";

const ERAS: readonly Era[] = ["historical", "present"];
const COLUMN: Record<Era, string> = { historical: "Then", present: "Now" };

type Place = { chapter: Chapter; card: TitleCard };

const yearOf = (c: Chapter, era: Era) => (era === "historical" ? c.historicalYear : c.presentYear);

// Four places down, two dates across. Every view is rendered here, each twice: as a table (768px
// and wider) and as one card per place (narrower), the same cells in both. MatrixViews shows one
// view at a time once its script runs; without it every view follows the last.
export function ComparisonMatrix({ chapters }: { chapters: readonly Chapter[] }) {
  const places = chapters.map((chapter, i) => ({ chapter, card: chapterTitleCard(chapter, i + 1, chapters.length) }));
  return (
    <MatrixViews
      panels={MATRIX_VIEWS.map(({ view, label }) => ({ view, label, content: <View view={view} label={label} places={places} /> }))}
    />
  );
}

function View({ view, label, places }: { view: MatrixView; label: string; places: Place[] }) {
  return (
    <>
      {view === "outcome" && <Legend />}
      <table data-matrix-table className="w-full table-fixed border-collapse font-interface text-sm">
        <caption className="sr-only">{`${label}, in each place: then and now`}</caption>
        <thead>
          <tr className="border-b border-(--hair) text-left">
            <th scope="col" className="w-[24%] py-2 pr-4 align-bottom">
              <span className="sr-only">Place</span>
            </th>
            {ERAS.map((era) => (
              <th key={era} scope="col" data-era={era} className="caps soft px-4 py-2 align-bottom">
                {COLUMN[era]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {places.map(({ chapter: c, card }) => (
            <tr key={c.slug} data-matrix-row={c.slug} className="border-b border-(--hair) align-top">
              <th scope="row" className="py-4 pr-4 text-left font-normal">
                <span className="block font-title text-[1.0625rem] leading-snug">{c.place}, {c.country}</span>
                <span className="soft mt-1 block tabular-nums">{c.historicalYear} and {c.presentYear}</span>
              </th>
              {ERAS.map((era) => (
                <td key={era} data-era={era} className="px-4 py-4">
                  <p className="caps soft tabular-nums">{yearOf(c, era)}</p>
                  <CellView chapter={c} card={card} era={era} view={view} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <ul data-matrix-cards className="flex flex-col gap-4">
        {places.map(({ chapter: c, card }) => (
          <li key={c.slug} data-matrix-row={c.slug} className="border-t border-(--hair) pt-4 font-interface text-sm">
            <h4 className="font-title text-[1.0625rem] leading-snug">{c.place}, {c.country}</h4>
            <div className="mt-3 flex flex-col gap-4">
              {ERAS.map((era) => (
                <div key={era} data-era={era} className="pl-3">
                  <h5 className="caps soft tabular-nums">{`${COLUMN[era]}, ${yearOf(c, era)}`}</h5>
                  <CellView chapter={c} card={card} era={era} view={view} />
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

// One cell: what it shows, then a link to the chapter section it summarises.
function CellView({ chapter: c, card, era, view }: { chapter: Chapter; card: TitleCard; era: Era; view: MatrixView }) {
  const cell = matrixCell(c, era, view);
  const year = yearOf(c, era);
  return (
    <div className="mt-1 flex flex-col items-start gap-2">
      {cell.kind === "text" && (
        <p className="font-yours text-base leading-normal"><SlotText value={cell.text} /></p>
      )}
      {cell.kind === "outcome" && (
        <>
          <p className="flex items-center gap-2">
            <ConfidenceMeter level={cell.level} />
            <span>{CONFIDENCE_WORDS[cell.level]}</span>
          </p>
          <div className="w-full">
            <Disclosure summary="Read the outcome" label={`Read the outcome, ${c.place}, ${year}`}>
              <div className="flex flex-col gap-2">
                <p className="font-yours text-base leading-normal"><SlotText value={cell.text} /></p>
                <p><span className="soft">Confidence:</span> <SlotText value={cell.confidence} /></p>
                <p><span className="soft">Citation:</span> <SlotText value={cell.citation} /></p>
              </div>
            </Disclosure>
          </div>
        </>
      )}
      {cell.kind === "none" && <p className="soft">{NO_PERSON_PLACED}</p>}
      <CoverLink href={cellHref(c.slug, cell.beat)} card={card} aria-label={`${sectionTag(cell.beat)}, ${c.place}, ${year}`} className="target quiet text-xs hover:text-interface-deep">
        {sectionTag(cell.beat)}
      </CoverLink>
    </div>
  );
}

// The confidence words with their meters: the meter is read by its filled steps, never by colour.
function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-interface text-sm">
      <p id="confidence-legend" className="caps soft">Confidence</p>
      <ul aria-labelledby="confidence-legend" className="flex flex-wrap gap-x-5 gap-y-2">
        {CONFIDENCE_LEVELS.map((level) => (
          <li key={level} className="flex items-center gap-2">
            <ConfidenceMeter level={level} />
            {CONFIDENCE_WORDS[level]}
          </li>
        ))}
      </ul>
    </div>
  );
}
