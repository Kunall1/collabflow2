"use client";

import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { PageLoader } from "@/components/ui/ProgressBar";
import { formatCurrency } from "@/lib/utils";

export default function BrandsPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", industry: "", contactName: "", contactEmail: "", color: "#6366F1" });

  useEffect(() => {
    fetch("/api/brands").then((r) => r.json()).then(setBrands).finally(() => setLoading(false));
  }, []);

  async function handleAdd() {
    const res = await fetch("/api/brands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const brand = await res.json();
      setBrands((prev) => [...prev, { ...brand, campaignCount: 0, totalEarned: 0 }]);
      setShowModal(false);
      setForm({ name: "", industry: "", contactName: "", contactEmail: "", color: "#6366F1" });
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this brand?")) return;
    await fetch(`/api/brands/${id}`, { method: "DELETE" });
    setBrands((prev) => prev.filter((b) => b.id !== id));
  }

  if (loading) return <PageLoader />;

  return (
    <div className="animate-slide-up">
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex justify-between items-center">
          <h3 className="text-sm font-bold text-txt">{brands.length} Brand Partners</h3>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gold/10 text-gold rounded-lg text-xs font-semibold hover:bg-gold/20 transition-colors"
          >
            <Plus size={14} /> Add Brand
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border">
                {["Brand", "Industry", "Contact", "Campaigns", "Earned", "Score", "Status", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-txt-muted font-semibold text-[11px] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {brands.map((b) => (
                <tr key={b.id} className="border-b border-border hover:bg-surface-hover/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-md flex items-center justify-center font-bold text-[10px] text-white shrink-0" style={{ background: b.color }}>{b.name[0]}</div>
                      <span className="font-semibold text-txt">{b.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-txt-muted">{b.industry}</td>
                  <td className="px-4 py-3 text-txt-muted font-mono text-xs">{b.contactEmail}</td>
                  <td className="px-4 py-3 text-txt">{b.campaignCount || b._count?.campaigns || 0}</td>
                  <td className="px-4 py-3 text-txt font-semibold">{formatCurrency(b.totalEarned || 0)}</td>
                  <td className="px-4 py-3"><ScoreRing score={b.score} size={36} /></td>
                  <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(b.id)} className="text-txt-dim hover:text-red-400 transition-colors">
                      <X size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Brand Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-md animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-base font-bold text-txt">Add New Brand</h3>
              <button onClick={() => setShowModal(false)} className="text-txt-muted hover:text-txt"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              {[
                { key: "name", label: "Brand Name", placeholder: "e.g. Nike" },
                { key: "industry", label: "Industry", placeholder: "e.g. Sportswear" },
                { key: "contactName", label: "Contact Name", placeholder: "e.g. Sarah Chen" },
                { key: "contactEmail", label: "Contact Email", placeholder: "e.g. sarah@nike.com" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-[11px] text-txt-muted font-semibold uppercase tracking-wider mb-1">{f.label}</label>
                  <input
                    value={(form as any)[f.key]}
                    onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-txt text-sm focus:border-gold/50 focus:outline-none"
                  />
                </div>
              ))}
              <div>
                <label className="block text-[11px] text-txt-muted font-semibold uppercase tracking-wider mb-1">Brand Color</label>
                <input type="color" value={form.color} onChange={(e) => setForm((p) => ({ ...p, color: e.target.value }))} className="w-12 h-8 bg-transparent border-0 cursor-pointer" />
              </div>
            </div>
            <button
              onClick={handleAdd}
              disabled={!form.name}
              className="w-full mt-5 py-2.5 gradient-gold rounded-lg text-[#0B0E14] text-sm font-bold hover:brightness-110 transition-all disabled:opacity-40"
            >
              Add Brand
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
