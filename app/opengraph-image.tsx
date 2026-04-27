import { ImageResponse } from "next/og";

import { SITE } from "@/constants";

export const runtime = "edge";
export const alt = `${SITE.NAME} — Motion-Powered React Components`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        width: "1200px",
        height: "630px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
        background: "#0a0a0a",
        boxSizing: "border-box",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "1040px",
          height: "500px",
          border: "1px solid #1f1f1f",
          borderRadius: "28px",
          background: "linear-gradient(160deg, #111111 0%, #0c0c0c 100%)",
          padding: "52px",
          justifyContent: "space-between",
          boxShadow: "0 30px 80px rgba(0, 0, 0, 0.45)",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: "20px",
                color: "#f5f5f5",
                fontWeight: 700,
                letterSpacing: "-0.4px",
              }}
            >
              iconiq.
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span
                style={{
                  fontSize: "13px",
                  color: "#8f8f8f",
                  fontWeight: 500,
                  letterSpacing: "0.15px",
                }}
              >
                iconiqui.com/registry
              </span>
              <span
                style={{
                  width: "9px",
                  height: "9px",
                  borderRadius: "999px",
                  background: "#2ae46e",
                  boxShadow: "0 0 14px #2ae46e80",
                }}
              />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <span
              style={{
                fontSize: "64px",
                fontWeight: 800,
                color: "#f8f8f8",
                lineHeight: "1.02",
                letterSpacing: "-2.4px",
              }}
            >
              Minimal UI.
            </span>
            <span
              style={{
                fontSize: "64px",
                fontWeight: 800,
                color: "#f8f8f8",
                lineHeight: "1.02",
                letterSpacing: "-2.4px",
              }}
            >
              Modern Motion.
            </span>
            <span
              style={{
                marginTop: "14px",
                fontSize: "18px",
                color: "#9c9c9c",
                lineHeight: "1.5",
                maxWidth: "760px",
              }}
            >
              Open-source React components with polished motion and source-first
              installation.
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              alignSelf: "flex-start",
              border: "1px solid #2c2c2c",
              borderRadius: "12px",
              padding: "11px 16px",
              fontSize: "15px",
              fontWeight: 500,
              color: "#e9e9e9",
              background: "#101010",
            }}
          >
            npx shadcn@latest add @iconiq/accordion
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "14px",
              color: "#8d8d8d",
              letterSpacing: "0.1px",
            }}
          >
            <span style={{ color: "#6f6f6f" }}>Architected by</span>
            <span style={{ color: "#f2f2f2", fontWeight: 600 }}>
              @edwinvakayil
            </span>
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: "-120px",
          top: "-120px",
          width: "360px",
          height: "360px",
          borderRadius: "999px",
          background: "radial-gradient(circle, #2ae46e25 0%, transparent 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: "-110px",
          bottom: "-120px",
          width: "340px",
          height: "340px",
          borderRadius: "999px",
          background: "radial-gradient(circle, #ffffff14 0%, transparent 70%)",
          display: "flex",
        }}
      />
    </div>,
    { ...size }
  );
}
