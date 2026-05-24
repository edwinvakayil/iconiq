import { redirect } from "next/navigation";

export default async function LegacyRadixBaseUiCatchAllPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  redirect(`/components/${slug.join("/")}`);
}
