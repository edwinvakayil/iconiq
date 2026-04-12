import { ImageResponse } from "next/og";

import { SITE } from "@/constants";

export const runtime = "edge";
export const alt = `${SITE.NAME} — Motion-Powered Icons and Components`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Palette drawn directly from the codebase's CSS variables
// --primary: #000000  --secondary: #3f3f47  --muted-foreground: #737373
// --border: #ebebeb   --sidebar-accent: #f4f4f4  green accent: #2ae46e
const MOSAIC: { bg: string }[] = [
  { bg: "#000000" },
  { bg: "#2ae46e" },
  { bg: "#ebebeb" },
  { bg: "#3f3f47" },
  { bg: "#f4f4f4" },

  { bg: "#f4f4f4" },
  { bg: "#737373" },
  { bg: "#000000" },
  { bg: "#ebebeb" },
  { bg: "#2ae46e" },

  { bg: "#2ae46e" },
  { bg: "#ebebeb" },
  { bg: "#3f3f47" },
  { bg: "#f4f4f4" },
  { bg: "#737373" },

  { bg: "#3f3f47" },
  { bg: "#f4f4f4" },
  { bg: "#2ae46e" },
  { bg: "#000000" },
  { bg: "#ebebeb" },
];

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        width: "1200px",
        height: "630px",
        display: "flex",
        flexDirection: "row",
        fontFamily: "sans-serif",
        background: "#ffffff",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* ── LEFT: content ── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "760px",
          boxSizing: "border-box",
          position: "relative",
        }}
      >
        {/* Green top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "760px",
            height: "4px",
            background: "#2ae46e",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            padding: "52px 64px 52px 64px",
          }}
        >
          {/* Logo + URL row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "12px" }}
            >
              <svg
                fill="none"
                height={30}
                viewBox="0 0 48 48"
                width={30}
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect fill="#000" height="18" rx="3" width="18" x="4" y="4" />
                <rect
                  fill="#000"
                  height="18"
                  opacity="0.5"
                  rx="3"
                  width="18"
                  x="26"
                  y="4"
                />
                <rect
                  fill="#000"
                  height="18"
                  opacity="0.75"
                  rx="3"
                  width="40"
                  x="4"
                  y="26"
                />
              </svg>
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#000000",
                  letterSpacing: "-0.5px",
                }}
              >
                iconiq.
              </span>
            </div>
            <span
              style={{
                fontSize: "13px",
                color: "#a3a3a3",
                fontWeight: 400,
                letterSpacing: "0.2px",
              }}
            >
              iconiqui.com
            </span>
          </div>

          {/* Headline + subtitle */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0px" }}
          >
            {/* "Free & Open-Source" eyebrow label */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "999px",
                  background: "#2ae46e",
                }}
              />
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#3f3f47",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                Free &amp; Open-Source Icon Library
              </span>
            </div>

            <span
              style={{
                fontSize: "60px",
                fontWeight: 800,
                color: "#000000",
                lineHeight: "1.05",
                letterSpacing: "-2.5px",
              }}
            >
              Motion-Powered
            </span>
            <span
              style={{
                fontSize: "60px",
                fontWeight: 800,
                color: "#000000",
                lineHeight: "1.05",
                letterSpacing: "-2.5px",
              }}
            >
              Icons &amp; Components
            </span>
            <span
              style={{
                marginTop: "20px",
                fontSize: "18px",
                color: "#737373",
                lineHeight: "1.65",
                maxWidth: "540px",
              }}
            >
              350+ animated icons and components. Built with Motion, based on
              Lucide. MIT licensed and copy-paste ready.
            </span>
          </div>

          {/* Badges + byline */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "14px" }}
          >
            <div
              style={{ display: "flex", gap: "8px", alignItems: "center" }}
            >
              {[
                "Open Source",
                "MIT Licensed",
                "350+ Icons",
                "Copy-Paste Ready",
              ].map((b) => (
                <div
                  key={b}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "5px 14px",
                    background: "#ffffff",
                    border: "1px solid #ebebeb",
                    borderRadius: "999px",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#3f3f47",
                  }}
                >
                  <div
                    style={{
                      width: "5px",
                      height: "5px",
                      borderRadius: "999px",
                      background: "#2ae46e",
                    }}
                  />
                  {b}
                </div>
              ))}
            </div>
            <span
              style={{ fontSize: "13px", color: "#a3a3a3", fontWeight: 400 }}
            >
              Built by edwinvakayil
            </span>
          </div>
        </div>
      </div>

      {/* ── RIGHT: mosaic panel ── */}
      <div
        style={{
          width: "440px",
          height: "630px",
          background: "#fafafa",
          borderLeft: "1px solid #ebebeb",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {/* 5 × 4 mosaic */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            width: "308px",
          }}
        >
          {MOSAIC.map((sq, i) => (
            <div
              key={i}
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "10px",
                background: sq.bg,
              }}
            />
          ))}
        </div>
      </div>
    </div>,
    { ...size },
  );
}
