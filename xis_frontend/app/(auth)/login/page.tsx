"use client";  
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [mounted, setMounted]   = useState(false);

  useEffect(() => {
    setMounted(true);
    const t = localStorage.getItem("xis_token");
    if (t) router.push("/dashboard");
  }, [router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const data = await api.login(username, password);
      localStorage.setItem("xis_token", data.access);
      router.push("/dashboard");
    } catch {
      setError("Invalid credentials. Check your username and password.");
    } finally {
      setLoading(false);
    }
  }

  if (!mounted) return null;

  return (
    <main className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="w-full max-w-md page-enter relative z-10">

        {/* Logo mark */}
        <div className="flex items-center gap-4 mb-10 justify-center">
          <div style={{
            width: 54, height: 54, borderRadius: 18,
            background: "linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(30, 58, 138, 0.3))",
            border: "1px solid rgba(56, 189, 248, 0.2)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 2px rgba(255,255,255,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <svg width="28" height="28" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="3" fill="var(--aurora)"/>
              <circle cx="10" cy="10" r="7" stroke="var(--aurora)" strokeWidth="1" strokeDasharray="2 2" fill="none" opacity="0.6"/>
              <circle cx="10" cy="3" r="1.5" fill="var(--plasma)"/>
              <circle cx="17" cy="10" r="1.5" fill="var(--stellar)"/>
            </svg>
          </div>
          <div>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 24, color: "var(--text-primary)", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
              XIS Analytics
            </p>
            <p style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", fontWeight: 500, marginTop: 4, textTransform: "uppercase" }}>
              Image Intelligence
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="glass-card" style={{ borderRadius: 32, padding: "48px 40px" }}>
          <div style={{ textAlign: "center" }}>
            <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8, letterSpacing: "-0.03em" }}>
              Mission Control
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: 15, marginBottom: 40 }}>
              Authenticate to access the observatory
            </p>
          </div>

          {error && (
            <div style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              borderRadius: 12, padding: "14px 16px",
              color: "#fca5a5", fontSize: 13, marginBottom: 24,
              display: "flex", alignItems: "center", gap: 10,
              fontWeight: 500
            }}>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.1em", marginBottom: 10, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>
                Identifier
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                style={{
                  width: "100%",
                  background: "rgba(2, 6, 23, 0.5)",
                  border: "1px solid var(--border)",
                  borderRadius: 14, padding: "14px 18px",
                  color: "var(--text-primary)",
                  fontSize: 15, outline: "none",
                  transition: "all 0.2s ease-in-out"
                }}
                className="focus-ring"
              />
            </div>

            <div style={{ marginBottom: 40 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.1em", marginBottom: 10, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>
                Passphrase
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: "100%",
                  background: "rgba(2, 6, 23, 0.5)",
                  border: "1px solid var(--border)",
                  borderRadius: 14, padding: "14px 18px",
                  color: "var(--text-primary)",
                  fontSize: 15, outline: "none",
                  transition: "all 0.2s ease-in-out"
                }}
                className="focus-ring"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="aurora-btn-solid w-full"
              style={{
                padding: "16px",
                borderRadius: 14,
                fontSize: 16,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 12
              }}
            >
              {loading ? (
                <>
                  <svg width="20" height="20" viewBox="0 0 16 16" fill="none" style={{ animation: "spin 1s linear infinite" }}>
                    <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
                    <path d="M8 2a6 6 0 0 1 6 6" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Authenticating...
                </>
              ) : (
                <>Initiate Access</>
              )}
            </button>

            <div style={{ textAlign: "center", marginTop: 24 }}>
               <p style={{ fontSize: 14, color: "var(--text-muted)" }}>
                 Don&apos;t have an identity? {" "}
                 <Link href="/signup" style={{ color: "var(--aurora)", fontWeight: 600, textDecoration: "none" }}>
                   Join the Mission
                 </Link>
               </p>
            </div>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: 32, fontSize: 12, color: "var(--text-muted)", fontWeight: 500, fontFamily: "'JetBrains Mono', monospace" }}>
          XIS · IMAGE INTELLIGENCE · v2.0
        </p>
      </div>

      <style jsx>{`
        @keyframes spin { to { transform: rotate(360deg) } } 
        .focus-ring:focus {
          border-color: var(--aurora) !important;
          box-shadow: 0 0 0 4px var(--aurora-dim) !important;
        }
      `}</style>
    </main>
  );
}

