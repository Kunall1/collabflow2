import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateShort(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function getStatusColor(status: string) {
  const map: Record<string, { bg: string; text: string; dot: string }> = {
    Active: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400" },
    Completed: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400" },
    Paused: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400" },
    Upcoming: { bg: "bg-violet-500/10", text: "text-violet-400", dot: "bg-violet-400" },
    Negotiating: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400" },
    Paid: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400" },
    Pending: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400" },
    Invoiced: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400" },
    Scheduled: { bg: "bg-violet-500/10", text: "text-violet-400", dot: "bg-violet-400" },
    Submitted: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400" },
    Approved: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400" },
    "In Progress": { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400" },
    Draft: { bg: "bg-violet-500/10", text: "text-violet-400", dot: "bg-violet-400" },
    "Not Started": { bg: "bg-slate-500/10", text: "text-slate-400", dot: "bg-slate-500" },
    Cancelled: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400" },
  };
  return map[status] || map["Not Started"];
}

export async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }
  return res.json();
}
