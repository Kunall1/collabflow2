"use client";

import { ChevronUp, ChevronDown, type LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  iconColor?: string;
}

export function StatCard({ label, value, change, icon: Icon, iconColor = "#D4A843" }: StatCardProps) {
  const isUp = change !== undefined && change >= 0;

  return (
    <div className="bg-card border border-border rounded-xl p-5 animate-fade-in">
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs text-txt-muted font-medium uppercase tracking-wider">{label}</span>
        <Icon size={18} style={{ color: iconColor }} className="opacity-70" />
      </div>
      <div className="text-2xl font-extrabold text-txt tracking-tight">{value}</div>
      {change !== undefined && (
        <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${isUp ? "text-emerald-400" : "text-red-400"}`}>
          {isUp ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {Math.abs(change)}% vs last month
        </div>
      )}
    </div>
  );
}
