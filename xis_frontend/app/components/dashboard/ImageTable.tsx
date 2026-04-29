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
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 8px" }}>
          <thead>
            <tr>
              {["", "#", "FILENAME", "SIZE", "DIMENSIONS", "LABEL", "TIMESTAMP"].map(
                (h, i) => (
                  <th
                    key={i}
                    style={{
                      textAlign: "left",
                      padding: "12px 16px",
                      fontSize: 10,
                      fontFamily: "'JetBrains Mono', monospace",
                      color: "var(--text-muted)",
                      letterSpacing: "0.1em",
                      fontWeight: 600,
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
                  className="table-row-hover"
                  style={{
                    background: "rgba(255, 255, 255, 0.02)",
                    transition: "all 0.2s ease",
                  }}
                >
                  {/* Thumbnail */}
                  <td style={{ padding: "12px 16px", width: 64, borderRadius: "12px 0 0 12px" }}>
                    {img.image_url && !failed ? (
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 10,
                          overflow: "hidden",
                          border: "1px solid var(--border)",
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
                          width: 44,
                          height: 44,
                          borderRadius: 10,
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid var(--border)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
                           <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                           <circle cx="8.5" cy="8.5" r="1.5" />
                           <polyline points="21 15 16 10 5 21" />
                         </svg>
                      </div>
                    )}
                  </td>

                  {/* ID */}
                  <td style={{ padding: "12px 16px", fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: "var(--aurora)" }}>
                    {String(img.id).padStart(3, "0")}
                  </td>

                  {/* Filename */}
                  <td style={{ padding: "12px 16px", maxWidth: 200, fontWeight: 500 }}>
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={img.filename}>
                      {img.filename}
                    </div>
                  </td>

                  {/* Size */}
                  <td style={{ padding: "12px 16px", color: "var(--text-secondary)", fontSize: 13 }}>
                    {img.size.toFixed(1)} <span style={{ fontSize: 10, opacity: 0.6 }}>KB</span>
                  </td>

                  {/* Dimensions */}
                  <td style={{ padding: "12px 16px", fontSize: 13, fontFamily: "'JetBrains Mono', monospace", color: "var(--text-muted)" }}>
                    {img.width && img.height
                      ? `${img.width}×${img.height}`
                      : "—"}
                  </td>

                  {/* Label */}
                  <td style={{ padding: "12px 16px" }}>
                    <span className="label-chip" style={{ fontSize: 10 }}>{img.label}</span>
                  </td>

                  {/* Timestamp */}
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "var(--text-muted)", borderRadius: "0 12px 12px 0" }}>
                    {safeDate && !isNaN(safeDate.getTime())
                      ? safeDate.toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false
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
            alignItems: "center",
            marginTop: 30,
            padding: "0 10px"
          }}
        >
          <p style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" }}>
            PAGE <span style={{ color: "var(--text-primary)" }}>{page}</span> / {totalPages} 
            <span style={{ margin: "0 12px", opacity: 0.3 }}>|</span>
            {total} RECORDS
          </p>

          <div style={{ display: "flex", gap: 12 }}>
            <button
              className="aurora-btn"
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              style={{ padding: "8px 16px", fontSize: 11, fontWeight: 600, opacity: page === 1 ? 0.4 : 1 }}
            >
              ← PREV
            </button>

            <button
              className="aurora-btn"
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
              style={{ padding: "8px 16px", fontSize: 11, fontWeight: 600, opacity: page === totalPages ? 0.4 : 1 }}
            >
              NEXT →
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .table-row-hover:hover {
          background: rgba(255, 255, 255, 0.05) !important;
          transform: scale(1.002);
        }
      `}</style>
    </div>
  );
}

