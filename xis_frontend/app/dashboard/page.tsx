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

      // ── FIX: normalize backend response ──
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
    <div style={{ minHeight: "100vh", color: "var(--text-primary)" }}>
      {/* ── NAVBAR ── */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(24px)",
          borderBottom: "1px solid var(--border)",
          padding: "0 40px",
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <p
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              fontSize: 18,
            }}
          >
            XIS <span style={{ fontWeight: 400 }}>Analytics</span>
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <span style={{ fontSize: 12 }}>{time}</span>

          <button onClick={logout}>EJECT</button>
        </div>
      </nav>

      {/* ── MAIN ── */}
      <main style={{ maxWidth: 1400, margin: "0 auto", padding: 40 }}>
        {error && <div style={{ color: "red" }}>{error}</div>}

        {/* ── STATS ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
          <StatsCard label="Total" value={count ?? "—"} sub="All time" delay="d1" />
          <StatsCard label="Labels" value={byLabel.length} sub="Categories" delay="d2" />
          <StatsCard label="Days" value={byDay.length} sub="Timeline" delay="d3" />
          <StatsCard label="Today" value={todayCount} sub="Uploads" delay="d4" />
        </div>

        {/* ── CHARTS ── */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginTop: 30 }}>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <>
              <ImagesPerDayChart data={byDay} />
              <ImagesPerLabelChart data={byLabel} />
            </>
          )}
        </div>

        {/* ── TABLE ── */}
        <div style={{ marginTop: 30 }}>
          {loading ? (
            <div>Loading table...</div>
          ) : (
            <ImageTable
              images={images}
              total={total}
              page={page}
              onPageChange={setPage}
            />
          )}
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
