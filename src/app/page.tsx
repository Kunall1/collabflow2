import Link from "next/link";
import {
  Briefcase, Activity, FileText, DollarSign, Calendar, BarChart3, ArrowRight,
} from "lucide-react";

const features = [
  { icon: Briefcase, title: "Brand Database", desc: "Manage contacts, track relationship scores, and monitor brand health across all partnerships." },
  { icon: Activity, title: "Campaign Tracking", desc: "From pitch to payment — every campaign stage tracked with budget utilization and progress bars." },
  { icon: FileText, title: "Deliverable Tracker", desc: "Never miss a deadline with smart status tracking per deliverable with payment linkage." },
  { icon: DollarSign, title: "Payment Tracking", desc: "Invoiced, pending, paid — know exactly where your money is with method and timeline tracking." },
  { icon: Calendar, title: "Campaign Calendar", desc: "Visual timeline of all deadlines, meetings, and milestones color-coded by brand." },
  { icon: BarChart3, title: "Analytics Dashboard", desc: "Revenue trends, platform split, brand relationship scores, and campaign performance." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gold/[0.06] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/[0.03] rounded-full blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="relative max-w-6xl mx-auto flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-[10px] gradient-gold flex items-center justify-center font-extrabold text-base text-[#0B0E14]">C</div>
          <span className="text-xl font-bold text-txt">CollabFlow</span>
        </div>
        <Link
          href="/login"
          className="px-6 py-2.5 bg-gold rounded-lg text-[#0B0E14] text-sm font-bold hover:brightness-110 transition-all"
        >
          Launch Dashboard <ArrowRight className="inline ml-1" size={14} />
        </Link>
      </nav>

      {/* Hero */}
      <div className="relative max-w-6xl mx-auto px-8 pt-20 pb-16 text-center">
        <div className="inline-block px-4 py-1.5 rounded-full bg-gold/10 text-gold text-xs font-semibold tracking-wider uppercase mb-6">
          For Creators Who Mean Business
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-txt leading-[1.08] tracking-tight mb-5">
          Your Brand Deals,
          <br />
          <span className="text-gold">Orchestrated.</span>
        </h1>
        <p className="text-lg text-txt-muted max-w-xl mx-auto mb-10 leading-relaxed">
          Track campaigns, manage deliverables, monitor payments, and grow brand relationships — all from one command center built for influencers.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-8 py-4 gradient-gold rounded-xl text-[#0B0E14] text-base font-bold glow-gold hover:brightness-110 transition-all"
        >
          Open Live Demo <ArrowRight size={16} />
        </Link>

        {/* Tech stack badges */}
        <div className="flex items-center justify-center gap-3 mt-8">
          {["Next.js 14", "Tailwind CSS", "PostgreSQL", "Prisma", "NextAuth"].map((t) => (
            <span key={t} className="px-3 py-1 rounded-full bg-surface border border-border text-[11px] text-txt-muted font-medium">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="relative max-w-6xl mx-auto px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <div
              key={i}
              className="p-6 bg-surface border border-border rounded-xl hover:border-border-light transition-colors group"
            >
              <f.icon size={20} className="text-gold mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-[15px] font-bold text-txt mb-2">{f.title}</h3>
              <p className="text-[13px] text-txt-muted leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-border py-8 text-center">
        <p className="text-xs text-txt-dim">
          Built by <span className="text-txt-muted font-medium">Rishabh Bhargava</span> · Full-stack SaaS demo with real API integration
        </p>
      </footer>
    </div>
  );
}
