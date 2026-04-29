"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "rgba(10,22,40,0.95)", border: "1px solid rgba(0,212,170,0.2)",
      borderRadius: 10, padding: "10px 14px", backdropFilter: "blur(20px)"
    }}>
      <p style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "var(--text-muted)", marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 20, fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "#00d4aa" }}>
        {payload[0].value} <span style={{ fontSize: 12, fontWeight: 400, color: "var(--text-secondary)" }}>images</span>
      </p>
    </div>
  );
};

export default function ImagesPerDayChart({ data }: { data: { date: string; count: number }[] }) {
  if (!data.length) return (
    <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "var(--text-muted)", fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>NO DATA AVAILABLE</p>
    </div>
  );
  const max = Math.max(...data.map(d => d.count));
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 4, right: 0, left: -28, bottom: 0 }} barSize={20}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,212,170,0.05)" vertical={false} />
        <XAxis dataKey="date" tick={{ fill: "rgba(232,244,253,0.3)", fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }} tickLine={false} axisLine={false}
          tickFormatter={v => v.slice(5)} />
        <YAxis tick={{ fill: "rgba(232,244,253,0.3)", fontSize: 10 }} tickLine={false} axisLine={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,212,170,0.04)" }} />
        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.count === max ? "#00d4aa" : "rgba(0,212,170,0.35)"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
