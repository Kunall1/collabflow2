"use client";

export function ProgressBar({ value, max, color = "#D4A843", height = 6 }: { value: number; max: number; color?: string; height?: number }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="w-full rounded-full" style={{ height, background: "#1E2536" }}>
      <div
        className="rounded-full transition-all duration-700 ease-out"
        style={{ width: `${pct}%`, height: "100%", background: color }}
      />
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-surface-hover rounded ${className}`} />
  );
}

export function PageLoader() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="col-span-2 h-72 rounded-xl" />
        <Skeleton className="h-72 rounded-xl" />
      </div>
    </div>
  );
}
