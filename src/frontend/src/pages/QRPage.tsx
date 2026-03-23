import { useEffect, useState } from "react";

export default function QRPage() {
  const [qrUrl, setQrUrl] = useState("");

  useEffect(() => {
    const base = `${window.location.protocol}//${window.location.host}`;
    const encoded = encodeURIComponent(base);
    setQrUrl(
      `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encoded}&bgcolor=F5EFE6&color=1A1020&margin=20&format=png`,
    );
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
      style={{
        background:
          "linear-gradient(160deg, #F5EFE6 0%, #fce4ec 50%, #F5EFE6 100%)",
        fontFamily: "'Figtree', sans-serif",
      }}
    >
      {/* Floating hearts */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {[
          {
            id: "qh-0",
            left: "10%",
            bottom: "5%",
            delay: "0s",
            dur: "2.5s",
            size: "14px",
          },
          {
            id: "qh-1",
            left: "22%",
            bottom: "14%",
            delay: "0.5s",
            dur: "3.2s",
            size: "22px",
          },
          {
            id: "qh-2",
            left: "34%",
            bottom: "23%",
            delay: "1s",
            dur: "2.5s",
            size: "30px",
          },
          {
            id: "qh-3",
            left: "46%",
            bottom: "5%",
            delay: "1.5s",
            dur: "3.2s",
            size: "14px",
          },
          {
            id: "qh-4",
            left: "58%",
            bottom: "14%",
            delay: "2s",
            dur: "2.5s",
            size: "22px",
          },
          {
            id: "qh-5",
            left: "70%",
            bottom: "23%",
            delay: "2.5s",
            dur: "3.2s",
            size: "30px",
          },
          {
            id: "qh-6",
            left: "82%",
            bottom: "5%",
            delay: "3s",
            dur: "2.5s",
            size: "14px",
          },
          {
            id: "qh-7",
            left: "94%",
            bottom: "14%",
            delay: "3.5s",
            dur: "3.2s",
            size: "22px",
          },
        ].map((item) => (
          <div
            key={item.id}
            className="absolute animate-float-heart"
            style={{
              left: item.left,
              bottom: item.bottom,
              animationDelay: item.delay,
              animationDuration: item.dur,
              fontSize: item.size,
              color: "#D47A86",
            }}
          >
            ❤️
          </div>
        ))}
      </div>

      <div
        className="relative z-10 w-full max-w-sm mx-auto text-center rounded-3xl p-8"
        style={{
          background: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(12px)",
          boxShadow:
            "0 8px 40px -8px rgba(212,122,134,0.35), 0 2px 16px rgba(212,122,134,0.12)",
          border: "1px solid rgba(212,122,134,0.25)",
        }}
      >
        <div className="mb-4" style={{ fontSize: "2.5rem" }}>
          💌
        </div>
        <h1
          className="font-display font-bold mb-2"
          style={{
            fontSize: "clamp(1.3rem, 5vw, 1.7rem)",
            color: "#1A1A1A",
            lineHeight: 1.3,
          }}
        >
          Scan to open Diya&#39;s Love Letter
        </h1>
        <p
          style={{
            color: "#D47A86",
            fontSize: "1.3rem",
            marginBottom: "1.5rem",
          }}
        >
          💌
        </p>

        {qrUrl ? (
          <div
            className="mx-auto rounded-2xl overflow-hidden mb-6"
            style={{
              width: 280,
              height: 280,
              border: "2px solid rgba(212,122,134,0.3)",
              boxShadow: "0 4px 20px rgba(212,122,134,0.2)",
            }}
          >
            <img
              src={qrUrl}
              alt="QR Code to open love letter"
              width={280}
              height={280}
              style={{ display: "block" }}
            />
          </div>
        ) : (
          <div
            className="mx-auto rounded-2xl mb-6 flex items-center justify-center"
            style={{
              width: 280,
              height: 280,
              background: "rgba(212,122,134,0.08)",
              border: "2px solid rgba(212,122,134,0.2)",
            }}
          >
            <span style={{ color: "#D47A86", fontSize: "2rem" }}>⏳</span>
          </div>
        )}

        <p
          className="font-body text-sm font-medium tracking-wide"
          style={{ color: "#6F6A63" }}
        >
          Show this to no one else 🤫
        </p>
        <p className="font-body text-xs mt-2" style={{ color: "#D47A86" }}>
          For Diya&#39;s eyes only 💕
        </p>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center">
        <p className="font-body text-xs" style={{ color: "#6F6A63" }}>
          &copy; {new Date().getFullYear()}. Built with{" "}
          <span style={{ color: "#D47A86" }}>♥</span> using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#D47A86" }}
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
