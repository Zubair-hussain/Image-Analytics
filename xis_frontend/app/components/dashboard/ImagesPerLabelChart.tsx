"use client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const PALETTE = ["#00d4aa", "#7c3aed", "#f0c040", "#ff6b6b", "#00b8d4", "#a855f7", "#fb923c"];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "rgba(10,22,40,0.95)", border: "1px solid rgba(0,212,170,0.2)",
      borderRadius: 10, padding: "10px 14px", backdropFilter: "blur(20px)"
    }}>
      <p style={{ fontSize: 13, fontFamily: "'Syne', sans-serif", fontWeight: 600, color: payload[0].payload.fill, marginBottom: 2 }}>
        {payload[0].name}
      </p>
      <p style={{ fontSize: 20, fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "var(--text-primary)" }}>
        {payload[0].value}
      </p>
    </div>
  );
};

const renderLegend = (props: any) => {
  const { payload } = props;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px", marginTop: 12, justifyContent: "center" }}>
      {payload?.map((entry: any, i: number) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: entry.color }} />
          <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "var(--text-secondary)" }}>{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function ImagesPerLabelChart({ data }: { data: { label: string; count: number }[] }) {
  if (!data.length) return (
    <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "var(--text-muted)", fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>NO DATA AVAILABLE</p>
    </div>
  );
  return (
    <ResponsiveContainer width="100%" height={230}>
      <PieChart>
        <Pie data={data} dataKey="count" nameKey="label" cx="50%" cy="45%" innerRadius={50} outerRadius={80} paddingAngle={3} stroke="none">
          {data.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend content={renderLegend} />
      </PieChart>
    </ResponsiveContainer>
  );
}
