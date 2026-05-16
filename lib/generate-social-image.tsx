import { ImageResponse } from "next/og";

import { SITE } from "@/constants";
import { OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH } from "@/seo/og-image";

const FOREGROUND = "#111111";
const SECONDARY = "#646b75";

const HEADING_SIZE = 52;
const LOGO_SIZE = 20;
const DESCRIPTION_SIZE = 18;
const MUTED = "#6d7480";

const headingStyle = {
  fontFamily: "Geist",
  fontSize: HEADING_SIZE,
  fontWeight: 500,
  letterSpacing: "-0.06em",
  lineHeight: 1.06,
} as const;

async function loadGeistMedium(): Promise<ArrayBuffer | null> {
  try {
    const response = await fetch(
      "https://cdn.jsdelivr.net/fontsource/fonts/geist-sans@5.2.5/latin-500-normal.woff"
    );

    if (!response.ok) {
      return null;
    }

    return response.arrayBuffer();
  } catch {
    return null;
  }
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

async function generateSocialImage() {
  const geistMedium = await loadGeistMedium();
  const fontFamily = geistMedium ? "Geist" : "sans-serif";

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
        fontFamily,
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
            <span style={{ marginRight: 8 }}>shadcn/ui</span>
            <span style={{ color: SECONDARY, marginRight: 8 }}>with</span>
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
            fontFamily,
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
      width: OG_IMAGE_WIDTH,
      height: OG_IMAGE_HEIGHT,
      fonts: geistMedium
        ? [
            {
              name: "Geist",
              data: geistMedium,
              style: "normal",
              weight: 500,
            },
          ]
        : undefined,
    }
  );
}

export { generateSocialImage };
