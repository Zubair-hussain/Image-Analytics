"use client";

import { useState } from "react";

interface Image {
  id: number;
  filename: string;
  size: number;
  label: string;
  timestamp: string;
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

export default function ImageTable({ images, total, page, onPageChange }: Props) {
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
              {["", "#", "FILENAME", "SIZE", "DIMENSIONS", "LABEL", "TIMESTAMP"].map((h, i) => (
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
              ))}
            </tr>
          </thead>

          <tbody>
            {images.map((img) => {
              const failed = failedImages[img.id];

              return (
                <tr
                  key={img.id}
                  style={{
                    borderBottom: "1px solid rgba(0,212,170,0.04)",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(0,212,170,0.025)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
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
                            display: "block",
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
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <rect
                            x="1"
                            y="3"
                            width="14"
                            height="10"
                            rx="2"
                            stroke="rgba(0,212,170,0.4)"
                            strokeWidth="1"
                          />
                          <circle
                            cx="5.5"
                            cy="7"
                            r="1.5"
                            stroke="rgba(0,212,170,0.4)"
                            strokeWidth="1"
                          />
                          <path
                            d="M1 11l3-2.5 2.5 1.5L10 7l5 4"
                            stroke="rgba(0,212,170,0.4)"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                  </td>

                  {/* ID */}
                  <td
                    style={{
                      padding: "10px 12px",
                      color: "var(--text-muted)",
                      fontSize: 12,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {String(img.id).padStart(3, "0")}
                  </td>

                  {/* Filename */}
                  <td
                    title={img.filename}
                    style={{
                      padding: "10px 12px",
                      color: "var(--text-primary)",
                      fontSize: 13,
                      maxWidth: 160,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {img.filename}
                  </td>

                  {/* Size */}
                  <td
                    style={{
                      padding: "10px 12px",
                      color: "var(--text-secondary)",
                      fontSize: 12,
                      fontFamily: "'JetBrains Mono', monospace",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {img.size.toFixed(1)} KB
                  </td>

                  {/* Dimensions */}
                  <td
                    style={{
                      padding: "10px 12px",
                      color: "var(--text-muted)",
                      fontSize: 11,
                      fontFamily: "'JetBrains Mono', monospace",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {img.width && img.height
                      ? `${img.width}×${img.height}`
                      : "—"}
                  </td>

                  {/* Label */}
                  <td style={{ padding: "10px 12px" }}>
                    <span className="label-chip">{img.label}</span>
                  </td>

                  {/* Timestamp */}
                  <td
                    style={{
                      padding: "10px 12px",
                      color: "var(--text-muted)",
                      fontSize: 11,
                      fontFamily: "'JetBrains Mono', monospace",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {new Date(img.timestamp).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
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
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 20,
          }}
        >
          <p
            style={{
              fontSize: 11,
              fontFamily: "'JetBrains Mono', monospace",
              color: "var(--text-muted)",
            }}
          >
            PAGE {page} / {totalPages} · {total} RECORDS
          </p>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className="aurora-btn"
              style={{
                padding: "6px 16px",
                borderRadius: 8,
                fontSize: 12,
                fontFamily: "'JetBrains Mono', monospace",
                cursor: page === 1 ? "not-allowed" : "pointer",
                opacity: page === 1 ? 0.3 : 1,
              }}
            >
              ← PREV
            </button>

            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
              className="aurora-btn"
              style={{
                padding: "6px 16px",
                borderRadius: 8,
                fontSize: 12,
                fontFamily: "'JetBrains Mono', monospace",
                cursor: page === totalPages ? "not-allowed" : "pointer",
                opacity: page === totalPages ? 0.3 : 1,
              }}
            >
              NEXT →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}