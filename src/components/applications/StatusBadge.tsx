import { STATUS_CONFIG, StatusKey } from "@/types";

export function StatusBadge({ status }: { status: StatusKey }) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bgClass}`}
    >
      {config.label}
    </span>
  );
}
