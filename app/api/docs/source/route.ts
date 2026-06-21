import { type NextRequest, NextResponse } from "next/server";
import type { BundledLanguage } from "shiki";

import { highlightCode } from "@/lib/shiki";
import { readComponentSource } from "@/lib/source-code";

const LANGUAGE_WHITELIST = new Set<BundledLanguage>([
  "tsx",
  "typescript",
  "bash",
  "json",
]);

const COMPONENT_NAME_PATTERN = /^[a-z0-9-]+$/i;

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as {
      component?: string;
      code?: string;
      lang?: string;
    };
    const requestedLang = (payload.lang || "tsx") as BundledLanguage;
    const lang = LANGUAGE_WHITELIST.has(requestedLang) ? requestedLang : "tsx";

    if (payload.component) {
      const componentName = payload.component.trim();
      if (!COMPONENT_NAME_PATTERN.test(componentName)) {
        return NextResponse.json(
          { error: "Invalid component name" },
          { status: 400 }
        );
      }

      const source = await readComponentSource(componentName);
      if (!source) {
        return NextResponse.json(
          { error: "Source not found" },
          { status: 404 }
        );
      }

      const html = await highlightCode(source.trim(), lang);
      return NextResponse.json({ code: source, html });
    }

    if (!payload.code || typeof payload.code !== "string") {
      return NextResponse.json({ error: "Missing code" }, { status: 400 });
    }

    const html = await highlightCode(payload.code.trim(), lang);
    return NextResponse.json({ html });
  } catch (error) {
    console.error("[api/docs/source]", error);
    return NextResponse.json(
      { error: "Unable to process request" },
      { status: 500 }
    );
  }
}
