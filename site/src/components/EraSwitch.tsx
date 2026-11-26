// Beat 6's era switch: pressed while the present-day mount is the one shown.
// What a press does (scroll or timed fade) belongs to ChangeOfDateMotion.
export function EraSwitch({ presentYear, pressed, onPress }: { presentYear: number; pressed: boolean; onPress: () => void }) {
  return (
    <button type="button" aria-pressed={pressed} onClick={onPress} className="target self-start px-2 font-interface text-sm underline">
      Show {presentYear}
    </button>
  );
}
