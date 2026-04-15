"use client";

import { useEffect, useState } from "react";
import { DollarSign, Clock, CheckCircle } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PageLoader } from "@/components/ui/ProgressBar";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/payments").then((r) => r.json()).then(setPayments).finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  const totalPaid = payments.filter((p) => p.status === "Paid").reduce((s, p) => s + p.amount, 0);
  const totalPending = payments.filter((p) => p.status !== "Paid").reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Paid" value={formatCurrency(totalPaid)} icon={CheckCircle} iconColor="#34D399" />
        <StatCard label="Pending" value={formatCurrency(totalPending)} icon={Clock} iconColor="#FBBF24" />
        <StatCard label="Transactions" value={payments.length} icon={DollarSign} iconColor="#60A5FA" />
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border">
              {["Brand", "Campaign", "Amount", "Date", "Method", "Status"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-txt-muted font-semibold text-[11px] uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-b border-border hover:bg-surface-hover/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: p.brandColor }} />
                    <span className="font-semibold text-txt">{p.brandName}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-txt-muted">{p.campaignTitle}</td>
                <td className="px-4 py-3 font-bold text-txt">{formatCurrency(p.amount)}</td>
                <td className="px-4 py-3 text-txt-muted font-mono text-xs">{p.paymentDate ? formatDate(p.paymentDate) : "TBD"}</td>
                <td className="px-4 py-3 text-txt-muted">{p.method}</td>
                <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
