import type { ReactNode } from "react";
import type { DetailItem } from "@/components/docs/page-shell";
import { LINK, SITE } from "@/constants";
import { AI_DISCOVERY_LINKS } from "@/lib/ai-discovery-links";
import { compactWhitespace, nodeToText } from "@/lib/node-to-text";
import { getPrimaryNavEntries, getSitelinkEntries } from "@/lib/seo-routes";
import { SITE_SECTIONS } from "@/lib/site-nav";
import { getSocialImageUrl, openGraphImagePath } from "@/seo/og-image";

const organizationId = `${SITE.URL}/#organization`;
const websiteId = `${SITE.URL}/#website`;

const componentCount = SITE_SECTIONS.reduce(
  (count, section) => count + section.children.length,
  0
);

const WebsiteJsonLd = () => {
  const sitelinks = getSitelinkEntries();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId,
    name: SITE.NAME,
    alternateName: [SITE.SHORT_NAME, SITE.LOGO.replace(".", "")],
    url: SITE.URL,
    description: SITE.DESCRIPTION.LONG,
    inLanguage: "en-US",
    image: getSocialImageUrl(openGraphImagePath),
    about: {
      "@id": `${SITE.URL}/#software`,
    },
    publisher: {
      "@id": organizationId,
    },
    hasPart: sitelinks.map((item) => ({
      "@type": "WebPage",
      name: item.name,
      url: item.url,
      description: item.description,
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

const SiteNavigationJsonLd = () => {
  const navigation = getPrimaryNavEntries();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${SITE.NAME} documentation navigation`,
    itemListElement: navigation.map((item, index) => ({
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

const SoftwareSourceCodeJsonLd = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    "@id": `${SITE.URL}/#software`,
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
      "@id": organizationId,
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
    "@id": organizationId,
    name: SITE.NAME,
    alternateName: SITE.SHORT_NAME,
    url: SITE.URL,
    logo: {
      "@type": "ImageObject",
      url: getSocialImageUrl(openGraphImagePath),
      width: 1200,
      height: 630,
    },
    image: getSocialImageUrl(openGraphImagePath),
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

const FAQJsonLd = () => {
  const faqs = [
    {
      question: "What is Iconiq UI?",
      answer: `${SITE.NAME} is an open-source library of motion-powered React components built around the shadcn registry workflow.`,
    },
    {
      question: "How do I install an Iconiq UI component?",
      answer: `Install components with shadcn using commands like npx shadcn@latest add @iconiq/b-button, or use a direct registry URL from ${SITE.URL}/r/b-button.json.`,
    },
    {
      question: "Is Iconiq UI free to use?",
      answer: `Yes. ${SITE.NAME} is open source and free to use for personal and commercial projects.`,
    },
    {
      question: "What technologies power Iconiq UI?",
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
      "Machine-readable catalog of Iconiq UI guides, component documentation, install commands, and API summaries.",
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
    size: componentCount,
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
  pageUrl,
  title,
}: {
  componentName: string;
  description: ReactNode;
  details: DetailItem[];
  pageUrl: string;
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

  const pageId = `${SITE.URL}${pageUrl}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": pageId,
        name: `${title} | ${SITE.NAME}`,
        description: componentDescription,
        url: pageId,
        inLanguage: "en-US",
        isPartOf: {
          "@id": websiteId,
        },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: SITE.NAME,
              item: SITE.URL,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: title,
              item: pageId,
            },
          ],
        },
      },
      {
        "@type": "TechArticle",
        headline: `${title} | ${SITE.NAME}`,
        name: `${title} component`,
        description: componentDescription,
        abstract: componentSummary || componentDescription,
        url: pageId,
        mainEntityOfPage: {
          "@id": pageId,
        },
        isPartOf: {
          "@id": websiteId,
        },
        publisher: {
          "@id": organizationId,
        },
        about: {
          "@type": "SoftwareSourceCode",
          name: title,
          description: componentSummary || componentDescription,
          codeRepository: LINK.GITHUB,
          programmingLanguage: ["TypeScript", "React"],
          runtimePlatform: "Web browser",
          url: `${SITE.URL}/r/${registryPath}`,
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
          "Iconiq UI",
          "shadcn registry",
          "component documentation",
        ],
      },
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

const HomePageWebPageJsonLd = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE.URL}/`,
    name: `${SITE.NAME} | Open Source React Component Library`,
    description: SITE.DESCRIPTION.LONG,
    url: SITE.URL,
    inLanguage: "en-US",
    isPartOf: {
      "@id": websiteId,
    },
    about: {
      "@id": `${SITE.URL}/#software`,
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: getSocialImageUrl(openGraphImagePath),
      width: 1200,
      height: 630,
    },
    publisher: {
      "@id": organizationId,
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

const HomePageJsonLd = () => {
  return (
    <>
      <HomePageWebPageJsonLd />
      <FAQJsonLd />
    </>
  );
};

const JsonLdScripts = () => {
  return (
    <>
      <WebsiteJsonLd />
      <SiteNavigationJsonLd />
      <SoftwareSourceCodeJsonLd />
      <OrganizationJsonLd />
      <AiCatalogJsonLd />
    </>
  );
};

export { ComponentDocJsonLd, HomePageJsonLd, JsonLdScripts };
