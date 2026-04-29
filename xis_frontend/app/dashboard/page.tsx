"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import StatsCard from "@/app/components/dashboard/StatsCard";
import ImagesPerDayChart from "@/app/components/dashboard/ImagesPerDayChart";
import ImagesPerLabelChart from "@/app/components/dashboard/ImagesPerLabelChart";
import ImageTable from "@/app/components/dashboard/ImageTable";
import AddImageModal from "@/app/components/dashboard/AddImageModal";

export default function DashboardPage() {
  const router = useRouter();
  const [count,    setCount]    = useState<number | null>(null);
  const [byDay,    setByDay]    = useState<any[]>([]);
  const [byLabel,  setByLabel]  = useState<any[]>([]);
  const [images,   setImages]   = useState<any[]>([]);
  const [total,    setTotal]    = useState(0);
  const [page,     setPage]     = useState(1);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [time,     setTime]     = useState("");
  const [showModal, setShowModal] = useState(false);

  // Live clock
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const fetchAll = useCallback(async (p = 1) => {
    try {
      setLoading(true); setError("");
      const [cntData, dayData, lblData, imgData] = await Promise.all([
        api.count(), api.byDay(), api.byLabel(), api.images(p),
      ]);
      setCount(cntData.count);
      setByDay(dayData);
      setByLabel(lblData);
      const items = imgData.items || imgData.results || [];
      const totalCount = imgData.count ?? 0;
      setImages(items);
      setTotal(totalCount);
    } catch {
      setError("Failed to fetch data from the observatory.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = localStorage.getItem("xis_token");
    if (!t) { router.push("/login"); return; }
    fetchAll(page);
  }, [page, fetchAll, router]);

  function logout() {
    localStorage.removeItem("xis_token");
    router.push("/login");
  }

  const todayCount = byDay.find(d => d.date === new Date().toISOString().slice(0, 10))?.count ?? 0;

  return (
    <div style={{ minHeight: "100vh", color: "var(--text-primary)" }}>
      
      {/* ── NAVBAR ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(0,0,0,0.4)", backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid var(--border)",
        padding: "0 40px", height: 72,
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 12,
            background: "linear-gradient(135deg, rgba(56,189,248,0.1), rgba(30,58,138,0.3))",
            border: "1px solid rgba(56,189,248,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="3" fill="var(--aurora)"/>
              <circle cx="10" cy="10" r="7" stroke="var(--aurora)" strokeWidth="1" strokeDasharray="2 2" fill="none" opacity="0.4"/>
              <circle cx="10" cy="3" r="1.5" fill="var(--plasma)"/>
            </svg>
          </div>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 18, letterSpacing: "-0.02em" }}>
            XIS <span style={{ fontWeight: 400, color: "var(--text-secondary)" }}>Analytics</span>
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="status-dot" />
            <span style={{ fontSize: 11, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", color: "var(--aurora)", letterSpacing: "0.1em" }}>SYSTEM ONLINE</span>
          </div>
          <span style={{ fontSize: 13, fontWeight: 500, fontFamily: "'JetBrains Mono', monospace", color: "var(--text-secondary)" }}>{time}</span>
          <button onClick={logout} style={{
            background: "rgba(239, 68, 68, 0.05)", border: "1px solid rgba(239, 68, 68, 0.2)",
            borderRadius: 10, padding: "8px 18px",
            color: "#fca5a5", fontSize: 12, fontWeight: 600,
            fontFamily: "'Inter', sans-serif", cursor: "pointer",
            transition: "all 0.2s"
          }}
            onMouseEnter={e => { (e.target as HTMLElement).style.background = "rgba(239, 68, 68, 0.15)"; (e.target as HTMLElement).style.borderColor = "#ef4444"; }}
            onMouseLeave={e => { (e.target as HTMLElement).style.background = "rgba(239, 68, 68, 0.05)"; (e.target as HTMLElement).style.borderColor = "rgba(239, 68, 68, 0.2)"; }}>
            EJECT
          </button>
        </div>
      </nav>

      {/* ── MAIN ── */}
      <main style={{ maxWidth: 1400, margin: "0 auto", padding: "48px 40px" }}>

        {/* Header */}
        <div className="page-enter" style={{ marginBottom: 44 }}>
          <div className="label-chip" style={{ marginBottom: 12 }}>MISSION CONTROL · OBSERVATORY V2.0</div>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 42, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.1 }}>
            Intelligence <span className="aurora-text">Dashboard</span>
          </h1>
        </div>

        {error && (
          <div style={{
            background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.2)",
            borderRadius: 16, padding: "16px 24px", marginBottom: 32,
            color: "#fca5a5", fontSize: 14, fontWeight: 500
          }}>{error}</div>
        )}

        {/* ── STATS ROW ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 32 }}>
          <StatsCard
            label="Total Registry" value={count ?? "—"} sub="All-time indexed" delay="d1"
            accent="var(--aurora)"
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>}
          />
          <StatsCard
            label="Classifications" value={byLabel.length} sub="Unique categories" delay="d2"
            accent="var(--plasma)"
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>}
          />
          <StatsCard
            label="Observation Days" value={byDay.length} sub="Active timeline" delay="d3"
            accent="var(--stellar)"
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18"/></svg>}
          />
          <StatsCard
            label="Live Delta" value={todayCount} sub="New uploads today" delay="d4"
            accent="#fb7185"
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>}
          />
        </div>

        {/* ── CHARTS ROW ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20, marginBottom: 32 }}>
          <div className="glass-card card-enter d5" style={{ borderRadius: 24, padding: "32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Temporal Analysis</p>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 20, fontWeight: 600 }}>Daily Activity</p>
              </div>
              <div className="label-chip" style={{ fontSize: 10 }}>VOLUMETRIC</div>
            </div>
            {loading ? <div className="shimmer" style={{ height: 240, borderRadius: 12 }} /> : <ImagesPerDayChart data={byDay} />}
          </div>

          <div className="glass-card card-enter d6" style={{ borderRadius: 24, padding: "32px" }}>
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Distribution</p>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 20, fontWeight: 600 }}>Label Weight</p>
            </div>
            {loading ? <div className="shimmer" style={{ height: 240, borderRadius: 12 }} /> : <ImagesPerLabelChart data={byLabel} />}
          </div>
        </div>

        {/* ── TABLE ── */}
        <div className="glass-card card-enter d6" style={{ borderRadius: 24, padding: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Data Grid</p>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 20, fontWeight: 600 }}>Object Registry</p>
            </div>
            <button
              onClick={() => fetchAll(page)}
              className="aurora-btn"
              style={{
                borderRadius: 10, padding: "10px 20px",
                fontSize: 12, fontWeight: 600,
                display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s"
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
              SYNC DATA
            </button>
          </div>
          {loading
            ? <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[...Array(5)].map((_, i) => <div key={i} className="shimmer" style={{ height: 56, borderRadius: 12 }} />)}
              </div>
            : <ImageTable images={images} total={total} page={page} onPageChange={setPage} />
          }
        </div>
      </main>

      {/* ── FAB ── */}
      <button
        onClick={() => setShowModal(true)}
        className="aurora-btn-solid"
        style={{
          position: "fixed", bottom: 40, right: 40, zIndex: 90,
          width: 64, height: 64, borderRadius: "50%", border: "none",
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          animation: "fabPulse 3s ease-in-out infinite",
        }}
        title="Ingest New Image"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M12 5v14M5 12h14" strokeLinecap="round"/>
        </svg>
      </button>

      {/* ── Modal ── */}
      {showModal && (
        <AddImageModal
          onClose={() => setShowModal(false)}
          onSuccess={() => fetchAll(1)}
        />
      )}

      <style>{`
        @keyframes fabPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.5); transform: scale(1); }
          50% { box-shadow: 0 0 0 15px rgba(56, 189, 248, 0); transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
