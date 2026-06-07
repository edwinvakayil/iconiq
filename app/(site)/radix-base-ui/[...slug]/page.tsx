import { redirect } from "next/navigation";

import { resolveLegacyDocsPath } from "@/lib/docs-url-redirects";

export default async function LegacyRadixBaseUiCatchAllPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  redirect(resolveLegacyDocsPath(`/components/${slug.join("/")}`));
}
