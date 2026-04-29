"use client";

import { useState } from "react";

interface Image {
  id: number;
  filename: string;
  size: number;
  label: string;
  timestamp?: string | null; // FIXED
  width?: number;
  height?: number;
  image_url?: string | null;
}

interface Props {
  images: Image[];
  total: number;
  page: number;
  onPageChange: (p: number) => void;
}

const LIMIT = 8;

export default function ImageTable({
  images,
  total,
  page,
  onPageChange,
}: Props) {
  const totalPages = Math.ceil(total / LIMIT);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  if (!images.length) {
    return (
      <div style={{ padding: "40px 0", textAlign: "center" }}>
        <p
          style={{
            color: "var(--text-muted)",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
          }}
        >
          NO RECORDS FOUND
        </p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["", "#", "FILENAME", "SIZE", "DIMENSIONS", "LABEL", "TIMESTAMP"].map(
                (h, i) => (
                  <th
                    key={i}
                    style={{
                      textAlign: "left",
                      padding: "8px 12px",
                      fontSize: 10,
                      fontFamily: "'JetBrains Mono', monospace",
                      color: "var(--text-muted)",
                      letterSpacing: "0.1em",
                      borderBottom: "1px solid rgba(0,212,170,0.08)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody>
            {images.map((img) => {
              const failed = failedImages[img.id];

              const safeDate = img.timestamp
                ? new Date(img.timestamp)
                : null;

              return (
                <tr
                  key={img.id}
                  style={{
                    borderBottom: "1px solid rgba(0,212,170,0.04)",
                    transition: "background 0.2s",
                  }}
                >
                  {/* Thumbnail */}
                  <td style={{ padding: "10px 12px", width: 48 }}>
                    {img.image_url && !failed ? (
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 8,
                          overflow: "hidden",
                          border: "1px solid rgba(0,212,170,0.15)",
                          background: "rgba(0,0,0,0.3)",
                        }}
                      >
                        <img
                          src={img.image_url}
                          alt={img.filename}
                          loading="lazy"
                          onError={() =>
                            setFailedImages((prev) => ({
                              ...prev,
                              [img.id]: true,
                            }))
                          }
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    ) : (
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 8,
                          background: "rgba(0,212,170,0.06)",
                          border: "1px solid rgba(0,212,170,0.1)",
                        }}
                      />
                    )}
                  </td>

                  {/* ID */}
                  <td style={{ padding: "10px 12px", fontSize: 12 }}>
                    {String(img.id).padStart(3, "0")}
                  </td>

                  {/* Filename */}
                  <td style={{ padding: "10px 12px", maxWidth: 160 }}>
                    {img.filename}
                  </td>

                  {/* Size */}
                  <td style={{ padding: "10px 12px" }}>
                    {img.size.toFixed(1)} KB
                  </td>

                  {/* Dimensions */}
                  <td style={{ padding: "10px 12px" }}>
                    {img.width && img.height
                      ? `${img.width}×${img.height}`
                      : "—"}
                  </td>

                  {/* Label */}
                  <td style={{ padding: "10px 12px" }}>
                    <span className="label-chip">{img.label}</span>
                  </td>

                  {/* Timestamp (FIXED SAFE) */}
                  <td style={{ padding: "10px 12px", fontSize: 11 }}>
                    {safeDate && !isNaN(safeDate.getTime())
                      ? safeDate.toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 20,
          }}
        >
          <p>
            PAGE {page} / {totalPages} · {total} RECORDS
          </p>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
            >
              ← PREV
            </button>

            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
            >
              NEXT →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
