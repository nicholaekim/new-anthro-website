import type { Era } from "@/content/types";
import { rangeValueText } from "@/motion/era";

// Beat 6's one control: the historical year and 2020 as buttons at the ends of a native range
// between them. The range gives arrow keys, Home and End for free. The button of the era in view
// is pressed. What a change does (scroll, tween or set at once) belongs to ChangeOfDateMotion.
export function EraSwitch({
  from,
  to,
  year,
  eraInView,
  onYear,
  onEra,
}: {
  from: number;
  to: number;
  year: number;
  eraInView: Era;
  onYear: (year: number) => void;
  onEra: (era: Era) => void;
}) {
  const button = (era: Era, label: number) => (
    <button
      type="button"
      aria-pressed={eraInView === era}
      aria-label={`Show ${label}`}
      onClick={() => onEra(era)}
      className="target quiet shrink-0 justify-center px-2 tabular-nums hover:text-interface"
    >
      {label}
    </button>
  );
  return (
    <div data-era-control className="flex items-center gap-2 font-interface text-sm sm:gap-4">
      {button("historical", from)}
      <input
        type="range"
        min={from}
        max={to}
        step={1}
        value={year}
        onChange={(e) => onYear(Number(e.currentTarget.value))}
        aria-label={`Date, from ${from} to ${to}`}
        aria-valuetext={rangeValueText(year, eraInView, from, to)}
        className="era-range min-w-0 flex-1"
      />
      {button("present", to)}
    </div>
  );
}
