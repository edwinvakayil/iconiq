import { ImageResponse } from "next/og";

import { SITE } from "@/constants";

export const runtime = "edge";
export const alt = `${SITE.NAME} — Motion-Powered React Components`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const FOREGROUND = "#111111";
const SECONDARY = "#646b75";
const BORDER = "rgba(227, 231, 236, 0.7)";

const HEADING_SIZE = 52;
const LOGO_SIZE = 20;
const MARK_SIZE = Math.round(HEADING_SIZE * 0.82);
const DESCRIPTION_SIZE = 18;
const MUTED = "#6d7480";

const headingStyle = {
  fontFamily: "Geist",
  fontSize: HEADING_SIZE,
  fontWeight: 500,
  letterSpacing: "-0.06em",
  lineHeight: 1.06,
} as const;

async function loadGeistMedium(): Promise<ArrayBuffer> {
  const response = await fetch(
    "https://cdn.jsdelivr.net/fontsource/fonts/geist-sans@5.2.5/latin-500-normal.woff"
  );

  if (!response.ok) {
    throw new Error("Failed to load Geist font");
  }

  return response.arrayBuffer();
}

function getAssetBaseUrl(): string {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return SITE.URL;
}

function IconiqWordmark() {
  const label = SITE.LOGO.endsWith(".") ? SITE.LOGO.slice(0, -1) : SITE.LOGO;
  const dot = SITE.LOGO.endsWith(".") ? "." : "";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        ...headingStyle,
        fontSize: LOGO_SIZE,
        lineHeight: 1,
        color: FOREGROUND,
      }}
    >
      <span>{label}</span>
      {dot ? <span style={{ marginLeft: 1, color: MUTED }}>{dot}</span> : null}
    </div>
  );
}

function HeroBrandMark({ src }: { src: string }) {
  return (
    // biome-ignore lint/performance/noImgElement: @vercel/og ImageResponse requires native img.
    <img
      alt=""
      height={MARK_SIZE}
      src={src}
      style={{
        width: MARK_SIZE,
        height: MARK_SIZE,
        borderRadius: "50%",
        border: `1px solid ${BORDER}`,
        objectFit: "cover",
        marginLeft: 10,
        marginRight: 10,
        boxShadow: "0 1px 0 rgba(0, 0, 0, 0.04)",
      }}
      width={MARK_SIZE}
    />
  );
}

export default async function OgImage() {
  const baseUrl = getAssetBaseUrl();
  const geistMedium = await loadGeistMedium();

  return new ImageResponse(
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#ffffff",
        fontFamily: "Geist",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 48,
          left: 48,
          display: "flex",
        }}
      >
        <IconiqWordmark />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          maxWidth: 1040,
          padding: "0 48px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              ...headingStyle,
              color: FOREGROUND,
            }}
          >
            <span style={{ marginRight: 8 }}>Built on</span>
            <HeroBrandMark src={`${baseUrl}/assets/shadcn.jpg`} />
            <span style={{ marginRight: 8 }}>shadcn/ui</span>
            <span style={{ color: SECONDARY, marginRight: 8 }}>with</span>
            <HeroBrandMark src={`${baseUrl}/assets/motion.png`} />
            <span>Motion</span>
          </div>

          <div
            style={{
              ...headingStyle,
              color: SECONDARY,
            }}
          >
            Copy the source. Ship the polish.
          </div>
        </div>

        <p
          style={{
            marginTop: 24,
            maxWidth: 760,
            fontFamily: "Geist",
            fontSize: DESCRIPTION_SIZE,
            fontWeight: 500,
            color: SECONDARY,
            lineHeight: 1.78,
            letterSpacing: "-0.01em",
          }}
        >
          shadcn/ui primitives you own, Motion animations you feel—paste a
          component, tune the tokens, and ship without the boilerplate hunt.
        </p>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Geist",
          data: geistMedium,
          style: "normal",
          weight: 500,
        },
      ],
    }
  );
}
