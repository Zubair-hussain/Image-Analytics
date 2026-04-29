"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api, ImageItem } from "@/lib/api";

import StatsCard from "@/app/components/dashboard/StatsCard";
import ImagesPerDayChart from "@/app/components/dashboard/ImagesPerDayChart";
import ImagesPerLabelChart from "@/app/components/dashboard/ImagesPerLabelChart";
import ImageTable from "@/app/components/dashboard/ImageTable";
import AddImageModal from "@/app/components/dashboard/AddImageModal";

export default function DashboardPage() {
  const router = useRouter();

  const [count, setCount] = useState<number | null>(null);
  const [byDay, setByDay] = useState<any[]>([]);
  const [byLabel, setByLabel] = useState<any[]>([]);

  const [images, setImages] = useState<ImageItem[]>([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [time, setTime] = useState("");
  const [showModal, setShowModal] = useState(false);

  // ── Live clock ──
  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString("en-US", { hour12: false }));

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // ── Fetch data ──
  const fetchAll = useCallback(async (p = 1) => {
    try {
      setLoading(true);
      setError("");

      const [cntData, dayData, lblData, imgData] = await Promise.all([
        api.count(),
        api.byDay(),
        api.byLabel(),
        api.images(p),
      ]);

      setCount(cntData.count);
      setByDay(dayData);
      setByLabel(lblData);

      const items = imgData.items || [];

      // ── normalize backend response ──
      const normalized: ImageItem[] = items.map((img: any) => ({
        id: img.id,
        filename: img.filename,
        size: img.size,
        label: img.label,
        timestamp: img.timestamp ?? null,
        width: img.width,
        height: img.height,
        image_url: img.image_url,
      }));

      setImages(normalized);
      setTotal(imgData.count ?? 0);
    } catch {
      setError("Failed to fetch data from the observatory.");
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Auth check ──
  useEffect(() => {
    const t = localStorage.getItem("xis_token");
    if (!t) {
      router.push("/login");
      return;
    }

    fetchAll(page);
  }, [page, fetchAll, router]);

  function logout() {
    localStorage.removeItem("xis_token");
    router.push("/login");
  }

  const todayCount =
    byDay.find(
      (d) => d.date === new Date().toISOString().slice(0, 10)
    )?.count ?? 0;

  return (
    <div className="page-enter" style={{ minHeight: "100vh" }}>
      {/* ── NAVBAR ── */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: "1px solid var(--border)",
          padding: "0 40px",
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div className="status-dot" />
          <p
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: "-0.02em"
            }}
          >
            XIS <span style={{ fontWeight: 400, color: "var(--text-secondary)" }}>Analytics</span>
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "var(--text-muted)" }}>
            {time}
          </span>

          <div style={{ height: 24, width: 1, background: "var(--border)" }} />

          <button 
            className="aurora-btn-solid"
            onClick={() => setShowModal(true)}
            style={{ padding: "8px 20px", borderRadius: 10, fontSize: 13 }}
          >
            DEPLOY UPLOAD
          </button>

          <button 
            onClick={logout}
            style={{ 
              fontSize: 11, 
              fontWeight: 600, 
              color: "var(--text-muted)",
              letterSpacing: "0.1em",
              padding: "4px 8px",
              border: "1px solid transparent",
              transition: "all 0.2s"
            }}
            onMouseOver={e => e.currentTarget.style.color = "var(--comet)"}
            onMouseOut={e => e.currentTarget.style.color = "var(--text-muted)"}
          >
            EJECT
          </button>
        </div>
      </nav>

      {/* ── MAIN ── */}
      <main style={{ maxWidth: 1400, margin: "0 auto", padding: "40px 40px 100px" }}>
        {error && (
          <div style={{ 
            padding: 16, 
            borderRadius: 12, 
            background: "rgba(239, 68, 68, 0.1)", 
            border: "1px solid rgba(239, 68, 68, 0.2)",
            color: "#fca5a5",
            marginBottom: 30,
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            gap: 12
          }}>
             <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
               <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
             </svg>
             {error}
          </div>
        )}

        {/* ── STATS ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
          <StatsCard label="Total" value={count ?? "—"} sub="All time" delay="d1" accent="var(--aurora)" />
          <StatsCard label="Labels" value={byLabel.length} sub="Categories" delay="d2" accent="var(--plasma)" />
          <StatsCard label="Days" value={byDay.length} sub="Timeline" delay="d3" accent="var(--stellar)" />
          <StatsCard label="Today" value={todayCount} sub="Uploads" delay="d4" accent="var(--aurora)" />
        </div>

        {/* ── CHARTS ── */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginTop: 30 }}>
          {loading ? (
            <div className="glass-card shimmer" style={{ height: 360, borderRadius: 24 }} />
          ) : (
            <>
              <div className="card-enter d5">
                <ImagesPerDayChart data={byDay} />
              </div>
              <div className="card-enter d6">
                <ImagesPerLabelChart data={byLabel} />
              </div>
            </>
          )}
        </div>

        {/* ── TABLE ── */}
        <div className="glass-card card-enter d6" style={{ marginTop: 30, borderRadius: 24, overflow: "hidden" }}>
          <div style={{ padding: "24px 30px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
             <h2 style={{ fontSize: 16, fontWeight: 600 }}>Observation Log</h2>
             <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" }}>
               {total} RECORDS LOADED
             </span>
          </div>
          <div style={{ padding: "10px 20px" }}>
            {loading ? (
              <div className="shimmer" style={{ height: 400, margin: "20px 0", borderRadius: 12 }} />
            ) : (
              <ImageTable
                images={images}
                total={total}
                page={page}
                onPageChange={setPage}
              />
            )}
          </div>
        </div>
      </main>

      {/* ── MODAL ── */}
      {showModal && (
        <AddImageModal
          onClose={() => setShowModal(false)}
          onSuccess={() => fetchAll(1)}
        />
      )}
    </div>
  );
}

