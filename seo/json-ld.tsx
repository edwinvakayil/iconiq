import type { ReactNode } from "react";
import type { DetailItem } from "@/components/docs/page-shell";
import { LINK, SITE } from "@/constants";
import { AI_DISCOVERY_LINKS, COMPONENT_CATALOG } from "@/lib/geo";
import { compactWhitespace, nodeToText } from "@/lib/node-to-text";
import { SITE_SECTIONS } from "@/lib/site-nav";
import { getSocialImageUrl, openGraphImagePath } from "@/seo/og-image";

const COMPONENT_ITEMS =
  SITE_SECTIONS.find((section) => section.label === "Components")?.children ??
  [];

const componentCount = COMPONENT_ITEMS.length;

const WebsiteJsonLd = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.NAME,
    url: SITE.URL,
    description: SITE.DESCRIPTION.LONG,
    inLanguage: "en-US",
    image: getSocialImageUrl(openGraphImagePath),
    publisher: {
      "@type": "Organization",
      name: SITE.NAME,
      url: SITE.URL,
    },
  };

  return (
    <script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD script payload
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      type="application/ld+json"
    />
  );
};

const SoftwareSourceCodeJsonLd = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: SITE.NAME,
    description: SITE.DESCRIPTION.LONG,
    url: SITE.URL,
    codeRepository: LINK.GITHUB,
    programmingLanguage: ["TypeScript", "React", "JavaScript"],
    runtimePlatform: "Web browser",
    codeSampleType: "UI component library",
    author: {
      "@type": "Person",
      name: SITE.AUTHOR.NAME,
      url: LINK.TWITTER,
    },
    maintainer: {
      "@type": "Person",
      name: SITE.AUTHOR.NAME,
      url: LINK.TWITTER,
    },
    keywords: SITE.KEYWORDS,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    isAccessibleForFree: true,
    numberOfItems: componentCount,
  };

  return (
    <script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD script payload
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      type="application/ld+json"
    />
  );
};

const OrganizationJsonLd = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.NAME,
    url: SITE.URL,
    logo: `${SITE.URL}/favicon.ico`,
    sameAs: [LINK.GITHUB, LINK.TWITTER],
    founder: {
      "@type": "Person",
      name: SITE.AUTHOR.NAME,
      url: LINK.TWITTER,
    },
  };

  return (
    <script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD script payload
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      type="application/ld+json"
    />
  );
};

const BreadcrumbJsonLd = ({
  items,
}: {
  items: { name: string; url: string }[];
}) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD script payload
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      type="application/ld+json"
    />
  );
};

const ComponentItemListJsonLd = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${SITE.NAME} components`,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: COMPONENT_ITEMS.length,
    itemListElement: COMPONENT_ITEMS.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      url: `${SITE.URL}${item.href}`,
    })),
  };

  return (
    <script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD script payload
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      type="application/ld+json"
    />
  );
};

const FAQJsonLd = () => {
  const faqs = [
    {
      question: "What is Iconiq?",
      answer: `${SITE.NAME} is an open-source library of motion-powered React components built around the shadcn registry workflow.`,
    },
    {
      question: "How do I install an Iconiq component?",
      answer: `Install components with shadcn using commands like npx shadcn@latest add @iconiq/button, or use a direct registry URL from ${SITE.URL}/r/button.json.`,
    },
    {
      question: "Is Iconiq free to use?",
      answer: `Yes. ${SITE.NAME} is open source and free to use for personal and commercial projects.`,
    },
    {
      question: "What technologies power Iconiq?",
      answer: `${SITE.NAME} components are written in TypeScript and React, with motion powered by Motion and registry delivery built around shadcn/ui conventions.`,
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD script payload
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      type="application/ld+json"
    />
  );
};

const AiCatalogJsonLd = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `${SITE.NAME} AI discovery index`,
    description:
      "Machine-readable catalog of Iconiq guides, component documentation, install commands, and API summaries.",
    url: AI_DISCOVERY_LINKS.indexJson,
    creator: {
      "@type": "Person",
      name: SITE.AUTHOR.NAME,
      url: LINK.TWITTER,
    },
    isAccessibleForFree: true,
    distribution: [
      {
        "@type": "DataDownload",
        encodingFormat: "application/json",
        contentUrl: AI_DISCOVERY_LINKS.indexJson,
      },
      {
        "@type": "DataDownload",
        encodingFormat: "text/plain",
        contentUrl: AI_DISCOVERY_LINKS.llmsOverview,
      },
      {
        "@type": "DataDownload",
        encodingFormat: "text/plain",
        contentUrl: AI_DISCOVERY_LINKS.llmsFull,
      },
    ],
    variableMeasured: [
      "component slug",
      "component name",
      "docs route",
      "install command",
      "registry path",
      "api summaries",
    ],
    size: COMPONENT_CATALOG.length,
  };

  return (
    <script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD script payload
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      type="application/ld+json"
    />
  );
};

const ComponentDocJsonLd = ({
  componentName,
  description,
  details,
  title,
}: {
  componentName: string;
  description: ReactNode;
  details: DetailItem[];
  title: string;
}) => {
  const primarySections = details.filter((item) => item.id !== "registry");
  const registryPath =
    details.find((item) => item.registryPath)?.registryPath ??
    `${componentName}.json`;
  const componentDescription = compactWhitespace(nodeToText(description));
  const componentSummary = compactWhitespace(
    nodeToText(primarySections[0]?.summary ?? primarySections[0]?.content ?? "")
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: `${title} component`,
    name: `${title} component`,
    description: componentDescription,
    abstract: componentSummary || componentDescription,
    url: `${SITE.URL}/components/${componentName}`,
    mainEntityOfPage: `${SITE.URL}/components/${componentName}`,
    about: {
      "@type": "SoftwareSourceCode",
      name: title,
      description: componentSummary || componentDescription,
      codeRepository: LINK.GITHUB,
      programmingLanguage: ["TypeScript", "React"],
      runtimePlatform: "Web browser",
      url: `${SITE.URL}/r/${registryPath}`,
    },
    isPartOf: {
      "@type": "CollectionPage",
      name: `${SITE.NAME} component documentation`,
      url: `${SITE.URL}/components/${componentName}`,
    },
    hasPart: primarySections.map((section) => ({
      "@type": "WebPageElement",
      name: compactWhitespace(nodeToText(section.title)),
      description: compactWhitespace(
        nodeToText(section.summary ?? section.content ?? "")
      ),
    })),
    keywords: [
      `${title} React component`,
      `@iconiq/${componentName}`,
      "shadcn registry",
      "component documentation",
    ],
  };

  return (
    <script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD script payload
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      type="application/ld+json"
    />
  );
};

const JsonLdScripts = () => {
  return (
    <>
      <WebsiteJsonLd />
      <SoftwareSourceCodeJsonLd />
      <OrganizationJsonLd />
      <FAQJsonLd />
      <AiCatalogJsonLd />
    </>
  );
};

export {
  AiCatalogJsonLd,
  BreadcrumbJsonLd,
  ComponentDocJsonLd,
  ComponentItemListJsonLd,
  FAQJsonLd,
  JsonLdScripts,
  OrganizationJsonLd,
  SoftwareSourceCodeJsonLd,
  WebsiteJsonLd,
};
