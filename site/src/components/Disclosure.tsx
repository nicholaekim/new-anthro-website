import type { ReactNode } from "react";

// A quiet row above a hairline; the browser's own marker shows that it opens.
export function Disclosure({ summary, children }: { summary: ReactNode; children: ReactNode }) {
  return (
    <details className="border-t border-(--hair) pt-3 font-interface text-sm">
      <summary className="py-0.5 underline decoration-transparent underline-offset-4 marker:text-(--soft) hover:decoration-current">
        {summary}
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  );
}
