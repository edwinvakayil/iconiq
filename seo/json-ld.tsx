import { LINK, SITE } from "@/constants";
import { SITE_SECTIONS } from "@/lib/site-nav";

const componentCount = SITE_SECTIONS.flatMap(
  (section) => section.children
).length;

const WebsiteJsonLd = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.NAME,
    url: SITE.URL,
    description: SITE.DESCRIPTION.LONG,
    inLanguage: "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.URL}?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
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
    runtimePlatform: "Node.js",
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
    dateModified: new Date().toISOString().split("T")[0],
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
    logo: `${SITE.URL}${SITE.OG_IMAGE}`,
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

const FAQJsonLd = () => {
  const faqs = [
    {
      question: "What is Iconiq?",
      answer: `${SITE.NAME} is an open-source library of motion-powered React components with a source-first registry workflow.`,
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

const JsonLdScripts = () => {
  return (
    <>
      <WebsiteJsonLd />
      <SoftwareSourceCodeJsonLd />
      <OrganizationJsonLd />
      <FAQJsonLd />
    </>
  );
};

export {
  BreadcrumbJsonLd,
  FAQJsonLd,
  JsonLdScripts,
  OrganizationJsonLd,
  SoftwareSourceCodeJsonLd,
  WebsiteJsonLd,
};
