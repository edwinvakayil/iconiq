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
        background: "linear-gradient(180deg, #ffffff 0%, #f6f8fb 100%)",
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
          border: "1px solid rgba(15, 23, 42, 0.08)",
          borderRadius: "28px",
          background: "linear-gradient(160deg, #ffffff 0%, #f8fafc 100%)",
          padding: "52px",
          justifyContent: "space-between",
          boxShadow: "0 26px 72px rgba(15, 23, 42, 0.1)",
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
                alignItems: "flex-end",
                color: "#111827",
                lineHeight: 1,
              }}
            >
              <span
                style={{
                  fontSize: "28px",
                  fontWeight: 700,
                  letterSpacing: "-2.4px",
                }}
              >
                iconiq
              </span>
              <span
                style={{
                  marginLeft: "2px",
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "#94a3b8",
                  letterSpacing: "-2.4px",
                }}
              >
                .
              </span>
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
                  color: "#64748b",
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
                  background: "#16a34a",
                  boxShadow: "0 0 12px rgba(22, 163, 74, 0.24)",
                }}
              />
            </div>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "14px",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontSize: "54px",
                  fontWeight: 800,
                  color: "#0f172a",
                  lineHeight: "1.02",
                  letterSpacing: "-2.4px",
                }}
              >
                Build UI that
              </span>
              <span
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "54px",
                  fontWeight: 800,
                  color: "#0ea5e9",
                  lineHeight: "1.02",
                  letterSpacing: "-2.4px",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: "-8px",
                    right: "-8px",
                    bottom: "-2px",
                    height: "16px",
                    transform: "translateY(38%)",
                    color: "rgba(125, 211, 252, 0.95)",
                  }}
                >
                  <svg
                    fill="none"
                    height="100%"
                    preserveAspectRatio="none"
                    viewBox="0 0 240 28"
                    width="100%"
                  >
                    <path
                      d="M6 18.5C28 14.2 52.4 15.1 75 14.4C102.2 13.6 129 13.5 156.4 12.9C182.9 12.3 207.5 11 234 9.8"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="11"
                    />
                    <path
                      d="M15 22.1C40.6 19.1 68 19.2 95.2 18.4C122.5 17.8 149.9 16.9 177.1 16.4C196.8 16 214.3 15.2 232 13.8"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="7"
                    />
                  </svg>
                </span>
                <span style={{ position: "relative" }}>stands out.</span>
              </span>
            </div>
            <span
              style={{
                fontSize: "54px",
                fontWeight: 800,
                color: "#0f172a",
                lineHeight: "1.02",
                letterSpacing: "-2.4px",
              }}
            >
              Without giving up the source.
            </span>
            <span
              style={{
                marginTop: "16px",
                fontSize: "18px",
                color: "#5f6b7a",
                lineHeight: "1.5",
                maxWidth: "700px",
              }}
            >
              Copy, customize, and ship polished React components in minutes.
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "14px",
              color: "#64748b",
              letterSpacing: "0.1px",
            }}
          >
            <span style={{ color: "#7c8797" }}>Architected by</span>
            <span style={{ color: "#0f172a", fontWeight: 600 }}>
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
          background:
            "radial-gradient(circle, rgba(14, 165, 233, 0.14) 0%, transparent 72%)",
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
          background:
            "radial-gradient(circle, rgba(34, 197, 94, 0.12) 0%, transparent 72%)",
          display: "flex",
        }}
      />
    </div>,
    { ...size }
  );
}
