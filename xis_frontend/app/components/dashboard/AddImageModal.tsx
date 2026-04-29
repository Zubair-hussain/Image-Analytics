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
          background: "rgba(0,0,0,0.6)",
          zIndex: 100,
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: 420,
          background: "#0a1628",
          padding: 20,
          borderRadius: 16,
          zIndex: 101,
          color: "#fff",
        }}
      >
        <h3 style={{ marginBottom: 12 }}>Upload Image</h3>

        {/* File Input */}
        <input type="file" accept="image/*" onChange={handleFileChange} />

        {/* Preview */}
        {preview && (
          <img
            src={preview}
            style={{
              width: "100%",
              marginTop: 12,
              borderRadius: 10,
            }}
          />
        )}

        {/* Result from backend */}
        {result && (
          <div style={{ marginTop: 12, color: "#00d4aa" }}>
            <p>Label: {result.label}</p>
            <p>Size: {result.size} KB</p>
            <p>
              Dimensions: {result.width} × {result.height}
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <p style={{ color: "red", marginTop: 10 }}>{error}</p>
        )}

        {/* Buttons */}
        <div style={{ display: "flex", gap: 10, marginTop: 15 }}>
          <button onClick={onClose}>Cancel</button>

          <button onClick={handleUpload} disabled={loading}>
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </>
  );
}