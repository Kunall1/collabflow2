"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("demo@collabflow.io");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid credentials. Have you seeded the database?");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  }

  async function handleSeed() {
    setSeeding(true);
    setSeedMsg("");
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      setSeedMsg(data.message || data.error || "Done!");
    } catch {
      setSeedMsg("Failed to seed. Check database connection.");
    }
    setSeeding(false);
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-gold/[0.05] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/3 w-[300px] h-[300px] bg-blue-500/[0.03] rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-sm p-8 bg-surface border border-border rounded-2xl animate-fade-in">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-[10px] gradient-gold flex items-center justify-center font-extrabold text-base text-[#0B0E14]">C</div>
          <span className="text-xl font-bold text-txt">CollabFlow</span>
        </div>

        <p className="text-sm text-txt-muted mb-6 leading-relaxed">
          Sign in to manage your brand collaborations
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] text-txt-muted font-semibold uppercase tracking-wider mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-bg border border-border rounded-lg text-txt text-sm focus:border-gold/50 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] text-txt-muted font-semibold uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-bg border border-border rounded-lg text-txt text-sm focus:border-gold/50 focus:outline-none transition-colors"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 gradient-gold rounded-lg text-[#0B0E14] text-sm font-bold hover:brightness-110 transition-all disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Seed DB */}
        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-[11px] text-txt-dim mb-2 text-center">First time? Seed the database with demo data</p>
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="w-full py-2 bg-surface-hover border border-border rounded-lg text-xs text-txt-muted font-medium hover:text-txt transition-all disabled:opacity-50"
          >
            {seeding ? "Seeding..." : "🌱 Seed Database"}
          </button>
          {seedMsg && (
            <p className="text-[11px] text-gold text-center mt-2">{seedMsg}</p>
          )}
        </div>

        <p className="text-center text-txt-dim text-[11px] mt-4">Demo credentials are pre-filled</p>
      </div>
    </div>
  );
}
