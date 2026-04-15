"use client";

import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ProgressBar, PageLoader } from "@/components/ui/ProgressBar";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ brandId: "", title: "", budget: "", startDate: "", endDate: "", platformType: "" });

  useEffect(() => {
    Promise.all([
      fetch("/api/campaigns").then((r) => r.json()),
      fetch("/api/brands").then((r) => r.json()),
    ])
      .then(([c, b]) => { setCampaigns(c); setBrands(b); })
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd() {
    const res = await fetch("/api/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, brandId: Number(form.brandId), budget: Number(form.budget) }),
    });
    if (res.ok) {
      const campaign = await res.json();
      const brand = brands.find((b: any) => b.id === campaign.brandId);
      setCampaigns((prev) => [{ ...campaign, brandName: brand?.name, brandColor: brand?.color, totalDeliverables: 0, completedDeliverables: 0 }, ...prev]);
      setShowModal(false);
      setForm({ brandId: "", title: "", budget: "", startDate: "", endDate: "", platformType: "" });
    }
  }

  async function handleStatusChange(id: number, status: string) {
    await fetch(`/api/campaigns/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setCampaigns((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  }

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-4 animate-slide-up">
      <div className="flex justify-end">
        <button onClick={() => setShowModal(true)} className="flex items-center gap-1.5 px-4 py-2 bg-gold/10 text-gold rounded-lg text-xs font-semibold hover:bg-gold/20 transition-colors">
          <Plus size={14} /> New Campaign
        </button>
      </div>

      {campaigns.map((c) => {
        const budgetPct = c.budget > 0 ? (c.spent / c.budget) * 100 : 0;
        return (
          <div key={c.id} className="bg-card border border-border rounded-xl p-6 hover:border-border-light transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: c.brandColor || "#6366F1" }} />
                  <span className="text-base font-bold text-txt">{c.title}</span>
                  <StatusBadge status={c.status} />
                </div>
                <div className="text-xs text-txt-muted ml-5">
                  {c.brandName} · {c.platformType} · {c.startDate ? formatDate(c.startDate) : "TBD"} → {c.endDate ? formatDate(c.endDate) : "TBD"}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-extrabold text-txt">{formatCurrency(c.budget)}</div>
                <div className="text-[11px] text-txt-muted">budget</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="flex justify-between text-[11px] text-txt-muted mb-1.5">
                  <span>Budget Spent</span>
                  <span>{formatCurrency(c.spent)} / {formatCurrency(c.budget)}</span>
                </div>
                <ProgressBar value={c.spent} max={c.budget} color={budgetPct > 90 ? "#F87171" : "#D4A843"} />
              </div>
              <div>
                <div className="flex justify-between text-[11px] text-txt-muted mb-1.5">
                  <span>Deliverables</span>
                  <span>{c.completedDeliverables || 0} / {c.totalDeliverables || 0}</span>
                </div>
                <ProgressBar value={c.completedDeliverables || 0} max={c.totalDeliverables || 1} color="#34D399" />
              </div>
            </div>

            {/* Quick status toggles */}
            <div className="flex gap-2 mt-4 pt-3 border-t border-border">
              {["Active", "Paused", "Completed"].map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(c.id, s)}
                  disabled={c.status === s}
                  className={`px-3 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    c.status === s
                      ? "bg-gold/15 text-gold cursor-default"
                      : "bg-surface-hover text-txt-dim hover:text-txt-muted"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        );
      })}

      {/* Add Campaign Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-md animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-base font-bold text-txt">New Campaign</h3>
              <button onClick={() => setShowModal(false)} className="text-txt-muted hover:text-txt"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] text-txt-muted font-semibold uppercase tracking-wider mb-1">Brand</label>
                <select
                  value={form.brandId}
                  onChange={(e) => setForm((p) => ({ ...p, brandId: e.target.value }))}
                  className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-txt text-sm focus:outline-none"
                >
                  <option value="">Select brand...</option>
                  {brands.map((b: any) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
              {[
                { key: "title", label: "Campaign Title", type: "text", placeholder: "e.g. Summer Fitness 2026" },
                { key: "budget", label: "Budget ($)", type: "number", placeholder: "e.g. 25000" },
                { key: "platformType", label: "Platform", type: "text", placeholder: "e.g. Instagram + YouTube" },
                { key: "startDate", label: "Start Date", type: "date", placeholder: "" },
                { key: "endDate", label: "End Date", type: "date", placeholder: "" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-[11px] text-txt-muted font-semibold uppercase tracking-wider mb-1">{f.label}</label>
                  <input
                    type={f.type}
                    value={(form as any)[f.key]}
                    onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-txt text-sm focus:outline-none"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={handleAdd}
              disabled={!form.title || !form.brandId}
              className="w-full mt-5 py-2.5 gradient-gold rounded-lg text-[#0B0E14] text-sm font-bold hover:brightness-110 disabled:opacity-40"
            >
              Create Campaign
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
