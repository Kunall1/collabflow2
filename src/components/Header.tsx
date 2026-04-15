"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Bell } from "lucide-react";

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/brands": "Brands",
  "/dashboard/campaigns": "Campaigns",
  "/dashboard/deliverables": "Deliverables",
  "/dashboard/payments": "Payments",
  "/dashboard/calendar": "Calendar",
  "/dashboard/analytics": "Analytics",
};

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const title = titles[pathname] || "Dashboard";
  const initial = session?.user?.name?.[0] || "U";

  return (
    <div className="flex justify-between items-center mb-6 pb-4 border-b border-border">
      <div>
        <h1 className="text-xl font-extrabold text-txt tracking-tight">{title}</h1>
        <p className="text-xs text-txt-muted mt-0.5">
          Welcome back, {session?.user?.name || "Creator"} · {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative text-txt-muted hover:text-txt transition-colors">
          <Bell size={18} />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-400" />
        </button>
        <div className="w-8 h-8 rounded-full gradient-gold flex items-center justify-center font-bold text-sm text-[#0B0E14]">
          {initial}
        </div>
      </div>
    </div>
  );
}
