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

  // clock
  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString("en-US", { hour12: false }));

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

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

      // ✅ FIXED
      const items = imgData.items ?? [];
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
    const token = localStorage.getItem("xis_token");

    if (!token) {
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
    <div style={{ minHeight: "100vh" }}>
      {/* NAV */}
      <nav>
        <h2>XIS Dashboard</h2>
        <button onClick={logout}>Logout</button>
      </nav>

      {/* MAIN */}
      <main style={{ maxWidth: 1400, margin: "0 auto", padding: 40 }}>
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* TABLE */}
        <ImageTable
          images={images}
          total={total}
          page={page}
          onPageChange={setPage}
        />
      </main>

      {/* MODAL */}
      {showModal && (
        <AddImageModal
          onClose={() => setShowModal(false)}
          onSuccess={() => fetchAll(1)}
        />
      )}
    </div>
  );
}
