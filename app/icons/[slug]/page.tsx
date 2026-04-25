import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CliBlock } from "@/components/cli-block";
import { DocsPageShell, DocsSection } from "@/components/docs/page-shell";
import { LINK, SITE } from "@/constants";
import { ICON_LIST } from "@/icons";
import { kebabToPascalCase } from "@/lib/kebab-to-pascal";
import { BreadcrumbJsonLd } from "@/seo/json-ld";
import { baseMetadata } from "@/seo/metadata";
import { IconCard } from "./icon-card";
import { SimilarIcons } from "./similar-icons";

type Props = {
  params: Promise<{ slug: string }>;
};

const getIconBySlug = (slug: string) => {
  return ICON_LIST.find((icon) => icon.name === slug);
};

export const generateStaticParams = () => {
  return ICON_LIST.map((icon) => ({
    slug: icon.name,
  }));
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { slug } = await params;
  const icon = getIconBySlug(slug);

  if (!icon) {
    return {
      title: "Icon Not Found",
    };
  }

  const pascalName = kebabToPascalCase(slug);
  const [keyword] = pascalName.split("Icon");

  const title = `${keyword} Icon - Motion-Powered React Icon`;
  const description = `Free motion-powered ${icon.name} icon for React. Part of the Motion-powered icons and components library, copy-paste ready. Keywords: ${icon.keywords.slice(0, 5).join(", ")}.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/icons/${slug}`,
    },
    openGraph: {
      ...baseMetadata.openGraph,
      title: `${pascalName} | ${SITE.NAME}`,
      description,
      url: `${SITE.URL}/icons/${slug}`,
      type: "website",
    },
    twitter: {
      ...baseMetadata.twitter,
      title: `${pascalName} | ${SITE.NAME}`,
      description,
    },
    keywords: [
      ...icon.keywords,
      "motion-powered icon",
      "animated icon",
      "react icon",
      "motion icon",
      `${icon.name} animation`,
      `${icon.name} react`,
    ],
  };
};

const IconJsonLd = ({ icon }: { icon: (typeof ICON_LIST)[number] }) => {
  const pascalName = kebabToPascalCase(icon.name);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: pascalName,
    description: `Animated ${icon.name} icon component for React`,
    codeRepository: LINK.GITHUB,
    programmingLanguage: ["TypeScript", "React"],
    isPartOf: {
      "@type": "SoftwareSourceCode",
      name: SITE.NAME,
      url: SITE.URL,
    },
    keywords: icon.keywords.join(", "),
  };

  return (
    <script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: ignore
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      type="application/ld+json"
    />
  );
};

const IconPage = async ({ params }: Props) => {
  const { slug } = await params;
  const icon = getIconBySlug(slug);

  if (!icon) {
    notFound();
  }

  const pascalName = kebabToPascalCase(slug);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE.URL },
          { name: "Icons", url: `${SITE.URL}/icons` },
          { name: pascalName, url: `${SITE.URL}/icons/${slug}` },
        ]}
      />
      <IconJsonLd icon={icon} />

      <DocsPageShell
        breadcrumbs={[
          { label: "Docs", href: "/" },
          { label: "Icons", href: "/icons" },
          { label: pascalName },
        ]}
        description={`Animated ${icon.name.replace(/-/g, " ")} icon for React. Install it directly into your codebase, then explore adjacent glyphs that share the same visual vocabulary.`}
        eyebrow="Animated Icon"
        meta={[
          { label: "Install", value: `@iconiq/${slug}` },
          { label: "Keywords", value: `${icon.keywords.length} terms` },
          { label: "Format", value: "React source file" },
        ]}
        title={pascalName}
      >
        <DocsSection
          className="lg:col-span-7"
          description="A larger preview surface with motion intact, so you can inspect the icon before copying the install command."
          index="01"
          title="Preview"
        >
          <IconCard icon={icon} />
        </DocsSection>

        <DocsSection
          className="lg:col-span-5"
          description="Copy the install command directly, then scan the keywords that power search and discovery."
          index="02"
          title="Install"
        >
          <div className="space-y-6">
            <CliBlock className="mt-0 px-0" staticIconName={slug} />
            <div className="flex flex-wrap gap-2">
              {icon.keywords.map((keyword, index) => (
                <span
                  className="border border-border border-dashed px-3 py-2 font-mono text-[10px] text-muted-foreground uppercase tracking-[0.18em]"
                  key={`${keyword}-${index}`}
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </DocsSection>

        <DocsSection
          className="lg:col-span-12"
          description="Explore related icons that share keywords with the current glyph."
          index="03"
          title="Similar Icons"
        >
          <SimilarIcons currentIcon={icon} />
        </DocsSection>
      </DocsPageShell>
    </>
  );
};

export default IconPage;
