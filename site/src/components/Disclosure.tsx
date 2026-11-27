import type { ReactNode } from "react";

// A quiet row above a hairline; the browser's own marker shows that it opens. label: the
// summary's accessible name, where the visible words need more to be told apart.
export function Disclosure({ summary, label, children }: { summary: ReactNode; label?: string; children: ReactNode }) {
  return (
    <details className="border-t border-(--hair) pt-3 font-interface text-sm">
      <summary aria-label={label} className="py-0.5 underline decoration-transparent underline-offset-4 marker:text-(--soft) hover:decoration-current">
        {summary}
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  );
}
