import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "6px",
          background: "linear-gradient(135deg,#7C3AED,#06B6D4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "14px",
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
