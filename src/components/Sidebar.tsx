"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, Briefcase, Activity, FileText,
  DollarSign, Calendar, BarChart3, LogOut,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/brands", icon: Briefcase, label: "Brands" },
  { href: "/dashboard/campaigns", icon: Activity, label: "Campaigns" },
  { href: "/dashboard/deliverables", icon: FileText, label: "Deliverables" },
  { href: "/dashboard/payments", icon: DollarSign, label: "Payments" },
  { href: "/dashboard/calendar", icon: Calendar, label: "Calendar" },
  { href: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 min-h-screen bg-surface border-r border-border flex flex-col py-5 px-3 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-2 mb-8">
        <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center font-extrabold text-sm text-[#0B0E14]">
          C
        </div>
        <span className="text-base font-bold text-txt">CollabFlow</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all ${
                isActive
                  ? "bg-gold/10 text-gold font-semibold"
                  : "text-txt-muted hover:text-txt hover:bg-surface-hover"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] text-txt-muted hover:text-txt hover:bg-surface-hover transition-all w-full"
      >
        <LogOut size={18} />
        Sign Out
      </button>
    </aside>
  );
}
