import { ImageResponse } from "next/og";

import { SITE } from "@/constants";

export const runtime = "edge";
export const alt = `${SITE.NAME} — Motion-Powered Icons and Components`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#ffffff",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        padding: "64px 72px",
        fontFamily: "sans-serif",
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <svg
          fill="none"
          height={44}
          viewBox="0 0 48 48"
          width={44}
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect fill="#000000" height="18" rx="3" width="18" x="4" y="4" />
          <rect
            fill="#000000"
            height="18"
            opacity="0.6"
            rx="3"
            width="18"
            x="26"
            y="4"
          />
          <rect
            fill="#000000"
            height="18"
            opacity="0.8"
            rx="3"
            width="40"
            x="4"
            y="26"
          />
        </svg>
        <span
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: "#000000",
            letterSpacing: "-0.5px",
          }}
        >
          iconiq.
        </span>
      </div>

      {/* Main content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "20px",
        }}
      >
        <h1
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "#000000",
            lineHeight: 1.05,
            letterSpacing: "-2px",
            margin: 0,
          }}
        >
          Motion-Powered
          <br />
          Icons & Components
        </h1>
        <p
          style={{
            fontSize: 26,
            color: "#737373",
            margin: 0,
            maxWidth: 680,
            lineHeight: 1.5,
          }}
        >
          350+ beautifully crafted animated icons and components. Built with
          Motion, based on Lucide. MIT licensed.
        </p>
      </div>

      {/* Footer badges */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {["Free & Open Source", "MIT Licensed", "Copy-Paste Ready", "350+ Icons"].map(
          (badge) => (
            <div
              key={badge}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "8px 18px",
                background: "#f4f4f5",
                borderRadius: "999px",
                fontSize: 18,
                fontWeight: 500,
                color: "#3f3f47",
              }}
            >
              {badge}
            </div>
          ),
        )}
      </div>
    </div>,
    { ...size },
  );
}
