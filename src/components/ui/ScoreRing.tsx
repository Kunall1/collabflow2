"use client";

export function ScoreRing({ score, size = 44 }: { score: number; size?: number }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 85 ? "#34D399" : score >= 70 ? "#FBBF24" : "#F87171";

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1E2536" strokeWidth="3" />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth="3"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-1000 ease-out"
      />
      <text
        x={size / 2} y={size / 2}
        textAnchor="middle" dominantBaseline="central"
        fill="#E8ECF4" fontSize={size > 40 ? 13 : 10} fontWeight="700"
        style={{ transform: "rotate(90deg)", transformOrigin: "center" }}
      >
        {score}
      </text>
    </svg>
  );
}
