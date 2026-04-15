"use client";

import { useEffect, useState } from "react";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { BrandRevenueChart, CampaignPerformanceChart, EarningsChart, PlatformChart } from "@/components/charts/Charts";
import { PageLoader } from "@/components/ui/ProgressBar";
import { formatCurrency } from "@/lib/utils";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics").then((r) => r.json()).then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;
  if (!data) return <p className="text-txt-muted">Failed to load analytics.</p>;

  const { monthlyEarnings, brandData, platformData, stats } = data;

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Summary Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Lifetime Revenue", value: formatCurrency(stats.totalRevenue), color: "#34D399" },
          { label: "Active Campaigns", value: stats.activeCampaigns, color: "#D4A843" },
          { label: "Brand Partners", value: stats.totalBrands, color: "#60A5FA" },
          { label: "Avg. Brand Score", value: brandData.length ? Math.round(brandData.reduce((s: number, b: any) => s + b.score, 0) / brandData.length) : 0, color: "#A78BFA" },
        ].map((s, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-5 text-center">
            <div className="text-[11px] text-txt-muted uppercase tracking-wider font-medium mb-2">{s.label}</div>
            <div className="text-2xl font-extrabold" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-sm font-bold text-txt mb-5">Revenue Trend</h3>
          <EarningsChart data={monthlyEarnings} />
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-sm font-bold text-txt mb-5">Revenue by Brand</h3>
          <BrandRevenueChart data={brandData} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-sm font-bold text-txt mb-5">Campaigns per Month</h3>
          <CampaignPerformanceChart data={monthlyEarnings} />
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-sm font-bold text-txt mb-5">Platform Distribution</h3>
          <PlatformChart data={platformData} />
        </div>
      </div>

      {/* Brand Relationship Scores */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-sm font-bold text-txt mb-5">Brand Relationship Scores</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {brandData.map((b: any, i: number) => (
            <div key={i} className="flex flex-col items-center p-5 bg-surface border border-border rounded-xl">
              <ScoreRing score={b.score} size={60} />
              <div className="text-sm font-bold text-txt mt-3">{b.name}</div>
              <div className="text-[11px] text-txt-muted">{b.campaigns} campaigns</div>
              <div className="text-[11px] text-emerald-400 font-semibold mt-1">{formatCurrency(b.revenue)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
