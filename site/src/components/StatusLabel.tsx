import type { Status } from "@/content/types";

export function StatusLabel({ status }: { status: Status }) {
  return (
    <span data-status={status} className="caps self-start text-ink border border-current/40 px-2 py-0.5">
      {status}
    </span>
  );
}
