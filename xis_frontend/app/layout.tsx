import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "XIS Analytics — Image Intelligence Platform",
  description: "Image Analytics Dashboard by XIS",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="cosmic-bg">
          <div className="stars" />
          <div className="cosmic-blob-1" />
          <div className="cosmic-blob-2" />
          <div className="cosmic-blob-3" />
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </div>
      </body>
    </html>
  );
}