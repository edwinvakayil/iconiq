import { redirect } from "next/navigation";

export default function LegacyRadixBaseUiCatchAllPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const { slug } = params;
  redirect(`/components/${slug.join("/")}`);
}
