"use client";

import { useEffect, useState } from "react";
import { DollarSign, Activity, Clock, Briefcase } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { EarningsChart, PlatformChart } from "@/components/charts/Charts";
import { PageLoader } from "@/components/ui/ProgressBar";
import { formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;
  if (!data) return <p className="text-txt-muted">Failed to load dashboard data.</p>;

  const { stats, monthlyEarnings, platformData, upcomingDeliverables, brandData } = data;

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Revenue" value={formatCurrency(stats.totalRevenue)} change={12} icon={DollarSign} iconColor="#34D399" />
        <StatCard label="Active Campaigns" value={stats.activeCampaigns} change={33} icon={Activity} iconColor="#D4A843" />
        <StatCard label="Pending Payments" value={formatCurrency(stats.totalPending)} change={-8} icon={Clock} iconColor="#FBBF24" />
        <StatCard label="Brand Partners" value={stats.totalBrands} change={20} icon={Briefcase} iconColor="#60A5FA" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
          <h3 className="text-sm font-bold text-txt mb-5">Monthly Earnings</h3>
          <EarningsChart data={monthlyEarnings} />
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-sm font-bold text-txt mb-5">Platform Split</h3>
          <PlatformChart data={platformData} />
        </div>
      </div>

      {/* Bottom Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Upcoming Deliverables */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-sm font-bold text-txt mb-4">Upcoming Deliverables</h3>
          <div className="space-y-0">
            {upcomingDeliverables.slice(0, 5).map((d: any) => (
              <div key={d.id} className="flex justify-between items-center py-3 border-b border-border last:border-0">
                <div>
                  <div className="text-[13px] font-semibold text-txt">{d.type}</div>
                  <div className="text-[11px] text-txt-muted">
                    {d.brandName} · Due {d.dueDate ? new Date(d.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "TBD"}
                  </div>
                </div>
                <StatusBadge status={d.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Brand Health */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-sm font-bold text-txt mb-4">Brand Health</h3>
          <div className="space-y-0">
            {brandData.slice(0, 5).map((b: any, i: number) => (
              <div key={i} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white shrink-0"
                  style={{ background: b.color }}
                >
                  {b.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-txt">{b.name}</div>
                  <div className="text-[11px] text-txt-muted">
                    {b.campaigns} campaigns · {formatCurrency(b.revenue)}
                  </div>
                </div>
                <ScoreRing score={b.score} size={38} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
