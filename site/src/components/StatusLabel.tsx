import type { Status } from "@/content/types";

export function StatusLabel({ status }: { status: Status }) {
  return (
    <span data-status={status} className="font-interface text-xs uppercase tracking-wide">
      {status}
    </span>
  );
}
