"use client";
import { useState } from "react";
import { api } from "@/lib/api";

export default function AddImageModal({ onClose, onSuccess }: any) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;

    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleUpload() {
    if (!file) {
      setError("Please select an image");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.upload(file);
      setResult(res);
      onSuccess();
    } catch (e) {
      setError("Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          zIndex: 100,
        }}
        className="page-enter"
      />

      {/* Modal */}
      <div
        className="glass-card page-enter"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: 480,
          padding: "40px",
          borderRadius: 32,
          zIndex: 101,
          boxShadow: "0 0 100px rgba(0,0,0,0.5), 0 0 0 1px var(--border)"
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
           <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Deploy Asset</h3>
           <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>Select an image for automated analysis</p>
        </div>

        {/* File Input */}
        <div style={{ 
          border: "2px dashed var(--border)", 
          borderRadius: 20, 
          padding: "30px 20px", 
          textAlign: "center",
          background: "rgba(255,255,255,0.02)",
          transition: "all 0.2s",
          cursor: "pointer",
          position: "relative"
        }}
        onMouseOver={e => e.currentTarget.style.borderColor = "var(--aurora-glow)"}
        onMouseOut={e => e.currentTarget.style.borderColor = "var(--border)"}
        >
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }}
          />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--aurora)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
               <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
               <polyline points="17 8 12 3 7 8" />
               <line x1="12" y1="3" x2="12" y2="15" />
             </svg>
             <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>
               {file ? file.name : "Click to select or drag and drop"}
             </p>
             <p style={{ fontSize: 11, color: "var(--text-muted)" }}>PNG, JPG or WEBP up to 10MB</p>
          </div>
        </div>

        {/* Preview */}
        {preview && (
          <div style={{ marginTop: 24, borderRadius: 16, overflow: "hidden", border: "1px solid var(--border)", background: "rgba(0,0,0,0.2)" }}>
            <img
              src={preview}
              style={{
                width: "100%",
                maxHeight: 200,
                objectFit: "contain",
                display: "block"
              }}
            />
          </div>
        )}

        {/* Result from backend */}
        {result && (
          <div style={{ 
            marginTop: 24, 
            padding: 16, 
            borderRadius: 16, 
            background: "rgba(56, 189, 248, 0.05)", 
            border: "1px solid rgba(56, 189, 248, 0.1)",
            fontFamily: "'JetBrains Mono', monospace"
          }}>
            <p style={{ fontSize: 11, color: "var(--aurora)", marginBottom: 8, fontWeight: 700 }}>ANALYSIS COMPLETE</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 12 }}>
               <div>
                 <span style={{ color: "var(--text-muted)", display: "block", fontSize: 10 }}>LABEL</span>
                 <span style={{ color: "var(--text-primary)" }}>{result.label}</span>
               </div>
               <div>
                 <span style={{ color: "var(--text-muted)", display: "block", fontSize: 10 }}>SIZE</span>
                 <span style={{ color: "var(--text-primary)" }}>{result.size.toFixed(1)} KB</span>
               </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <p style={{ color: "var(--comet)", marginTop: 16, fontSize: 13, textAlign: "center", fontWeight: 500 }}>{error}</p>
        )}

        {/* Buttons */}
        <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
          <button 
            onClick={onClose}
            className="aurora-btn"
            style={{ flex: 1, padding: "14px", borderRadius: 14, fontSize: 14, fontWeight: 600 }}
          >
            Cancel
          </button>

          <button 
            onClick={handleUpload} 
            disabled={loading || !file}
            className="aurora-btn-solid"
            style={{ flex: 1, padding: "14px", borderRadius: 14, fontSize: 14, fontWeight: 600, opacity: (loading || !file) ? 0.5 : 1 }}
          >
            {loading ? "Analyzing..." : "Start Analysis"}
          </button>
        </div>
      </div>
    </>
  );
}

