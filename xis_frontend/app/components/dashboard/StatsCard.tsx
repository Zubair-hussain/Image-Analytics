"use client";
interface Props {
  label: string;
  value: number | string;
  sub?: string;
  accent?: string;
  icon?: React.ReactNode;
  delay?: string;
}

export default function StatsCard({ label, value, sub, accent = "#00d4aa", icon, delay = "d1" }: Props) {
  return (
    <div className={`glass-card card-enter ${delay}`} style={{ borderRadius: 16, padding: "24px 28px", position: "relative", overflow: "hidden" }}>
      {/* Accent glow */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        opacity: 0.7
      }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
            {label}
          </p>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 40, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.03em", lineHeight: 1 }}>
            {value === null || value === undefined ? "—" : value}
          </p>
          {sub && <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 6 }}>{sub}</p>}
        </div>
        {icon && (
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: `rgba(${accent === "#00d4aa" ? "0,212,170" : accent === "#7c3aed" ? "124,58,237" : "240,192,64"},0.1)`,
            border: `1px solid ${accent}22`,
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
