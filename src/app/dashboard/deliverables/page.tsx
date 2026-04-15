"use client";

import { useEffect, useState } from "react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PageLoader } from "@/components/ui/ProgressBar";
import { formatCurrency, formatDate } from "@/lib/utils";

const STATUSES = ["All", "Not Started", "Draft", "In Progress", "Submitted", "Approved", "Paid"];

export default function DeliverablesPage() {
  const [deliverables, setDeliverables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetch("/api/deliverables").then((r) => r.json()).then(setDeliverables).finally(() => setLoading(false));
  }, []);

  async function updateStatus(id: number, status: string) {
    await fetch(`/api/deliverables/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setDeliverables((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)));
  }

  const filtered = filter === "All" ? deliverables : deliverables.filter((d) => d.status === filter);

  if (loading) return <PageLoader />;

  return (
    <div className="animate-slide-up">
      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === s ? "bg-gold/15 text-gold" : "bg-surface text-txt-muted hover:text-txt border border-border"
            }`}
          >
            {s} {s !== "All" && <span className="ml-1 opacity-60">({deliverables.filter((d) => s === "All" || d.status === s).length})</span>}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border">
              {["Type", "Campaign", "Brand", "Due Date", "Payment", "Status", "Action"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-txt-muted font-semibold text-[11px] uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((d) => (
              <tr key={d.id} className="border-b border-border hover:bg-surface-hover/50 transition-colors">
                <td className="px-4 py-3 font-semibold text-txt">{d.type}</td>
                <td className="px-4 py-3 text-txt-muted">{d.campaignTitle}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: d.brandColor }} />
                    <span className="text-txt-muted">{d.brandName}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-txt font-mono text-xs">{d.dueDate ? formatDate(d.dueDate) : "TBD"}</td>
                <td className="px-4 py-3 font-semibold text-emerald-400">{formatCurrency(d.payment)}</td>
                <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                <td className="px-4 py-3">
                  <select
                    value={d.status}
                    onChange={(e) => updateStatus(d.id, e.target.value)}
                    className="bg-bg border border-border rounded px-2 py-1 text-[11px] text-txt-muted focus:outline-none cursor-pointer"
                  >
                    {STATUSES.filter((s) => s !== "All").map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-txt-dim text-sm">No deliverables found for this filter.</div>
        )}
      </div>
    </div>
  );
}
