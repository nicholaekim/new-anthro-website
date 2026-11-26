import type { ReactNode } from "react";

export function Disclosure({ summary, children }: { summary: ReactNode; children: ReactNode }) {
  return (
    <details className="font-interface">
      <summary>{summary}</summary>
      <div className="mt-2">{children}</div>
    </details>
  );
}
