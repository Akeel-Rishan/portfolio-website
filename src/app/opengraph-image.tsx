import { ImageResponse } from "next/og";
import { SITE } from "@/lib/constants";

export const runtime = "edge";
export const alt = `${SITE.name} - AI Engineer Portfolio`;
export const size = {
  width: 1200,
  height: 630
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "82px",
          background: "#0A0A0F",
          color: "#F8F8FF",
          fontFamily: "Inter, Arial, sans-serif"
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(124,58,237,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.10) 1px, transparent 1px)",
            backgroundSize: "42px 42px"
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 520,
            height: 520,
            right: -120,
            bottom: -160,
            borderRadius: 999,
            background: "radial-gradient(circle, rgba(124,58,237,0.72), rgba(6,182,212,0.28) 42%, transparent 68%)",
            filter: "blur(12px)"
          }}
        />
        <div style={{ position: "relative", display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              color: "#06B6D4",
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: 3,
              textTransform: "uppercase"
            }}
          >
            <span style={{ width: 14, height: 14, borderRadius: 999, background: "#22C55E" }} />
            Available for production AI work
          </div>
          <h1 style={{ margin: "34px 0 0", fontSize: 92, lineHeight: 1, fontWeight: 900 }}>
            {SITE.name}
          </h1>
          <div
            style={{
              marginTop: 20,
              fontSize: 58,
              lineHeight: 1.1,
              fontWeight: 800,
              color: "#A78BFA"
            }}
          >
            AI Engineer
          </div>
          <p style={{ width: 860, marginTop: 28, fontSize: 28, lineHeight: 1.35, color: "#D1D5DB" }}>
            Production-grade LLM systems, RAG pipelines, autonomous agents, and measurable AI product engineering.
          </p>
          <div style={{ display: "flex", gap: 14, marginTop: 42 }}>
            {["LLMs", "RAG", "Agents", "FastAPI", "Next.js"].map((badge) => (
              <span
                key={badge}
                style={{
                  padding: "12px 18px",
                  borderRadius: 999,
                  border: "1px solid rgba(6,182,212,0.46)",
                  background: "rgba(17,17,24,0.86)",
                  color: "#CFFAFE",
                  fontSize: 22,
                  fontWeight: 700
                }}
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    ),
    size
  );
}
