"use client";

import { getStatusColor } from "@/lib/utils";

export function StatusBadge({ status }: { status: string }) {
  const colors = getStatusColor(status);
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${colors.bg} ${colors.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
      {status}
    </span>
  );
}
