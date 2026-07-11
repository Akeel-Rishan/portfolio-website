import { ImageResponse } from "next/og";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yourdomain.com"; // REPLACE WITH YOUR ACTUAL DOMAIN
const displayDomain = BASE_URL.replace(/^https?:\/\//, "").replace(/\/$/, "");

export const runtime = "edge";
export const alt = "Akeel Rishan - AI Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#0A0A0F",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          color: "#F8F8FF"
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(124,58,237,0.15) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(6,182,212,0.1) 0%, transparent 50%)"
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg,#7C3AED,#06B6D4)"
          }}
        />
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "linear-gradient(135deg,#7C3AED,#06B6D4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "32px",
            fontSize: "28px",
            fontWeight: 700,
            color: "white"
          }}
        >
          AR
        </div>
        <div
          style={{
            fontSize: "64px",
            fontWeight: 700,
            color: "#F8F8FF",
            lineHeight: 1.1,
            marginBottom: "16px"
          }}
        >
          Akeel Rishan
        </div>
        <div
          style={{
            fontSize: "28px",
            color: "#7C3AED",
            fontWeight: 600,
            marginBottom: "20px"
          }}
        >
          AI Engineer & Software Developer
        </div>
        <div
          style={{
            fontSize: "18px",
            color: "#9CA3AF",
            lineHeight: 1.5,
            maxWidth: "700px",
            marginBottom: "40px"
          }}
        >
          Building production-grade LLM systems, RAG pipelines, and autonomous AI agents - Sri Lanka
        </div>
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap"
          }}
        >
          {["LLMs", "RAG", "AI Agents", "Next.js", "FastAPI", "Gemini"].map((tag) => (
            <div
              key={tag}
              style={{
                padding: "8px 16px",
                background: "rgba(124,58,237,0.15)",
                border: "1px solid rgba(124,58,237,0.3)",
                borderRadius: "20px",
                fontSize: "14px",
                color: "#A78BFA",
                fontWeight: 500
              }}
            >
              {tag}
            </div>
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            right: "80px",
            fontSize: "16px",
            color: "#6B7280"
          }}
        >
          {displayDomain}
        </div>
      </div>
    ),
    { ...size }
  );
}
