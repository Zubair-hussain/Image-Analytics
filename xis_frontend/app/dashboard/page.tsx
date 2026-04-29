"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api, ImageItem } from "@/lib/api";

import StatsCard from "@/app/components/dashboard/StatsCard";
import ImagesPerDayChart from "@/app/components/dashboard/ImagesPerDayChart";
import ImagesPerLabelChart from "@/app/components/dashboard/ImagesPerLabelChart";
import ImageTable from "@/app/components/dashboard/ImageTable";
import AddImageModal from "@/app/components/dashboard/AddImageModal";

// ── Types ──
type DayStat = { date: string; count: number };
type LabelStat = { label: string; count: number };

export default function DashboardPage() {
  const router = useRouter();

  const [count, setCount] = useState<number | null>(null);
  const [byDay, setByDay] = useState<DayStat[]>([]);
  const [byLabel, setByLabel] = useState<LabelStat[]>([]);
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
  const fetchAll = useCallback(async (p: number = 1) => {
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

      //  FIXED (no results fallback)
      setImages(imgData.items);
      setTotal(imgData.count ?? 0);

    } catch (err: any) {
      setError(err?.message || "Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Auth guard ──
  useEffect(() => {
    const token = localStorage.getItem("xis_token");

    if (!token) {
      router.push("/login");
      return;
    }

    fetchAll(page);
  }, [page, fetchAll, router]);

  // ── Logout ──
  function logout() {
    localStorage.removeItem("xis_token");
    router.push("/login");
  }

  // ── Today count (typed fix) ──
  const todayISO = new Date().toISOString().slice(0, 10);

  const todayCount =
    byDay.find((d) => d.date === todayISO)?.count ?? 0;

  return (
    <div style={{ minHeight: "100vh", color: "var(--text-primary)" }}>
      
      {/* ── NAVBAR ── */}
      <nav style={{
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
        justifyContent: "space-between"
      }}>
        <div style={{ fontWeight: 700 }}>XIS Analytics</div>

        <div style={{ display: "flex", gap: 20 }}>
          <span>{time}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </nav>

      {/* ── MAIN ── */}
      <main style={{ maxWidth: 1400, margin: "0 auto", padding: 40 }}>

        {/* Error */}
        {error && (
          <p style={{ color: "red", marginBottom: 20 }}>
            {error}
          </p>
        )}

        {/* ── STATS ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 20,
          marginBottom: 32
        }}>
          <StatsCard label="Total" value={count ?? "—"} />
          <StatsCard label="Labels" value={byLabel.length} />
          <StatsCard label="Days" value={byDay.length} />
          <StatsCard label="Today" value={todayCount} />
        </div>

        {/* ── CHARTS ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 20,
          marginBottom: 32
        }}>
          <ImagesPerDayChart data={byDay} />
          <ImagesPerLabelChart data={byLabel} />
        </div>

        {/* ── TABLE ── */}
        <ImageTable
          images={images}
          total={total}
          page={page}
          onPageChange={setPage}
        />
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
