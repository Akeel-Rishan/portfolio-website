import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "180px",
          height: "180px",
          borderRadius: "36px",
          background: "linear-gradient(135deg,#7C3AED,#06B6D4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "72px",
          fontWeight: 700,
          color: "white",
          fontFamily: "Georgia, serif"
        }}
      >
        AR
      </div>
    ),
    { ...size }
  );
}
