"use client";

import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-border-light rounded-lg px-3 py-2 shadow-2xl">
      <p className="text-txt-muted text-[11px] mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-sm font-semibold" style={{ color: p.color || "#D4A843" }}>
          {typeof p.value === "number" && p.name !== "campaigns"
            ? `$${p.value.toLocaleString()}`
            : p.value}{" "}
          {p.name !== "earnings" ? p.name : ""}
        </p>
      ))}
    </div>
  );
}

export function EarningsChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D4A843" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#D4A843" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1E2536" />
        <XAxis dataKey="month" stroke="#4A5568" fontSize={11} />
        <YAxis stroke="#4A5568" fontSize={11} tickFormatter={(v) => `$${v / 1000}k`} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="earnings" stroke="#D4A843" fill="url(#earningsGrad)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function PlatformChart({ data }: { data: { name: string; value: number; color: string }[] }) {
  return (
    <div>
      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" strokeWidth={0}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-2 mt-2">
        {data.map((p, i) => (
          <div key={i} className="flex items-center gap-1.5 text-[11px] text-txt-muted">
            <span className="w-2 h-2 rounded-sm" style={{ background: p.color }} />
            {p.name} {p.value}%
          </div>
        ))}
      </div>
    </div>
  );
}

export function BrandRevenueChart({ data }: { data: { name: string; revenue: number; color: string }[] }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="#1E2536" horizontal={false} />
        <XAxis type="number" stroke="#4A5568" fontSize={11} tickFormatter={(v) => `$${v / 1000}k`} />
        <YAxis type="category" dataKey="name" stroke="#4A5568" fontSize={11} width={60} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function CampaignPerformanceChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1E2536" />
        <XAxis dataKey="month" stroke="#4A5568" fontSize={11} />
        <YAxis stroke="#4A5568" fontSize={11} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="campaigns" fill="#60A5FA" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
