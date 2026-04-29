"use client";  
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

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
    <main 
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "linear-gradient(135deg, #0b1120 0%, #000000 100%)",
        fontFamily: "'Inter', sans-serif",
        color: "#ffffff"
      }}
    >
      <div className="w-full max-w-md page-enter">

        {/* Logo mark */}
        <div className="flex items-center gap-4 mb-10 justify-center">
          <div style={{
            width: 48, height: 48, borderRadius: 16,
            background: "linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(30, 58, 138, 0.3))",
            border: "1px solid rgba(56, 189, 248, 0.2)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 2px rgba(255,255,255,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="3" fill="#38bdf8"/>
              <circle cx="10" cy="10" r="7" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" fill="none" opacity="0.6"/>
              <circle cx="10" cy="3" r="1.5" fill="#818cf8"/>
              <circle cx="17" cy="10" r="1.5" fill="#60a5fa"/>
            </svg>
          </div>
          <div>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 22, color: "#f8fafc", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
              XIS Analytics
            </p>
            <p style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'Inter', sans-serif", letterSpacing: "0.05em", fontWeight: 500, marginTop: 2 }}>
              IMAGE INTELLIGENCE
            </p>
          </div>
        </div>

        {/* Card */}
        <div 
          className="scan-line" 
          style={{ 
            background: "linear-gradient(145deg, rgba(15, 23, 42, 0.6), rgba(0, 0, 0, 0.4))",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(0,0,0,0.5)",
            borderRadius: 24, 
            padding: "48px 40px" 
          }}
        >
          <div style={{ textAlign: "center" }}>
            <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 32, fontWeight: 700, marginBottom: 8, letterSpacing: "-0.03em", color: "#ffffff" }}>
              Mission Control
            </h1>
            <p style={{ color: "#94a3b8", fontSize: 15, marginBottom: 36, fontWeight: 400 }}>
              Authenticate to access the observatory
            </p>
          </div>

          {error && (
            <div style={{
              background: "linear-gradient(90deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05))",
              borderLeft: "3px solid #ef4444",
              borderTop: "1px solid rgba(239, 68, 68, 0.1)",
              borderRight: "1px solid rgba(239, 68, 68, 0.1)",
              borderBottom: "1px solid rgba(239, 68, 68, 0.1)",
              borderRadius: 8, padding: "12px 16px",
              color: "#fca5a5", fontSize: 13, marginBottom: 24,
              display: "flex", alignItems: "center", gap: 10,
              fontWeight: 500
            }}>
              <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6.5" stroke="#ef4444" strokeWidth="1.2"/>
                <path d="M7 4v3M7 9.5v.5" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#94a3b8", letterSpacing: "0.05em", marginBottom: 8, textTransform: "uppercase" }}>
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
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: 12, padding: "14px 16px",
                  color: "#f8fafc",
                  fontSize: 15, outline: "none",
                  transition: "all 0.2s ease-in-out",
                  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)"
                }}
                onFocus={e => {
                  e.target.style.borderColor = "#38bdf8";
                  e.target.style.boxShadow = "0 0 0 3px rgba(56, 189, 248, 0.15), inset 0 2px 4px rgba(0,0,0,0.2)";
                }}
                onBlur={e => {
                  e.target.style.borderColor = "rgba(255, 255, 255, 0.08)";
                  e.target.style.boxShadow = "inset 0 2px 4px rgba(0,0,0,0.2)";
                }}
              />
            </div>

            <div style={{ marginBottom: 36 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#94a3b8", letterSpacing: "0.05em", marginBottom: 8, textTransform: "uppercase" }}>
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
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: 12, padding: "14px 16px",
                  color: "#f8fafc",
                  fontSize: 15, outline: "none",
                  transition: "all 0.2s ease-in-out",
                  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)"
                }}
                onFocus={e => {
                  e.target.style.borderColor = "#38bdf8";
                  e.target.style.boxShadow = "0 0 0 3px rgba(56, 189, 248, 0.15), inset 0 2px 4px rgba(0,0,0,0.2)";
                }}
                onBlur={e => {
                  e.target.style.borderColor = "rgba(255, 255, 255, 0.08)";
                  e.target.style.boxShadow = "inset 0 2px 4px rgba(0,0,0,0.2)";
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "14px",
                background: "linear-gradient(135deg, #2563eb, #1e40af)",
                color: "#ffffff",
                boxShadow: "0 4px 14px 0 rgba(37, 99, 235, 0.39)",
                borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)",
                fontSize: 16, fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                transition: "transform 0.1s ease, box-shadow 0.2s ease",
              }}
              onMouseOver={e => { if(!loading) e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseOut={e => { if(!loading) e.currentTarget.style.transform = "translateY(0)"; }}
            >
              {loading ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" style={{ animation: "spin 1s linear infinite" }}>
                    <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
                    <path d="M8 2a6 6 0 0 1 6 6" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Authenticating...
                </>
              ) : (
                <>Initiate Access</>
              )}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: 24, fontSize: 13, color: "#64748b", fontWeight: 500 }}>
          XIS · Image Intelligence Platform · v2.0
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@400;600;700&display=swap');
        
        @keyframes spin { 
          to { transform: rotate(360deg) } 
        } 
        
        .scan-line { 
          position: relative; 
          overflow: hidden;
        }
        
        /* Optional subtle animated gradient overlay for the premium feel */
        .scan-line::before {
          content: "";
          position: absolute;
          top: 0; left: -100%; width: 50%; height: 100%;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.03), transparent);
          transform: skewX(-20deg);
          animation: shine 6s infinite;
          pointer-events: none;
        }

        @keyframes shine {
          0% { left: -100%; }
          20% { left: 200%; }
          100% { left: 200%; }
        }
        
        ::placeholder {
          color: #475569;
        }
      `}</style>
    </main>
  );
}
