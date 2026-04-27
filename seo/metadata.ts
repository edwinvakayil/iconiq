import type { Metadata } from "next";

import { LINK, SITE } from "@/constants";

type CreateMetadataOptions = {
  title?: string;
  description?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  keywords?: string[];
  noIndex?: boolean;
};

const canonicalToUrl = (canonical?: string) => {
  if (!canonical) {
    return SITE.URL;
  }

  if (canonical.startsWith("http://") || canonical.startsWith("https://")) {
    return canonical;
  }

  return `${SITE.URL}${canonical}`;
};

const createMetadata = (options: CreateMetadataOptions = {}): Metadata => {
  const {
    title,
    description = SITE.DESCRIPTION.SHORT,
    canonical,
    ogTitle,
    ogDescription,
    keywords,
    noIndex = false,
  } = options;
  const canonicalUrl = canonicalToUrl(canonical);
  const mergedKeywords = keywords
    ? Array.from(new Set([...SITE.KEYWORDS, ...keywords]))
    : [...SITE.KEYWORDS];
  const resolvedTitle = title
    ? title.includes(SITE.NAME)
      ? { absolute: title }
      : title
    : undefined;

  return {
    ...(resolvedTitle && { title: resolvedTitle }),
    description,
    keywords: mergedKeywords,
    referrer: "origin-when-cross-origin",
    ...(canonical && {
      alternates: {
        canonical,
      },
    }),
    openGraph: {
      title: ogTitle || title || SITE.NAME,
      description: ogDescription || description,
      url: canonicalUrl,
      siteName: SITE.NAME,
      locale: "en_US",
      type: "website",
      images: [
        {
          url: SITE.OG_IMAGE,
          width: 1200,
          height: 630,
          alt: `${SITE.NAME} Open Graph image`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle || title || SITE.NAME,
      description: ogDescription || description,
      creator: SITE.AUTHOR.TWITTER,
      site: SITE.AUTHOR.TWITTER,
      images: [SITE.OG_IMAGE],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          nocache: true,
        }
      : {
          index: true,
          follow: true,
          nocache: false,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
};

const baseMetadata: Metadata = {
  metadataBase: new URL(SITE.URL),
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: SITE.NAME,
    description: SITE.DESCRIPTION.SHORT,
    siteName: SITE.NAME,
    type: "website",
    locale: "en_US",
    url: SITE.URL,
    images: [
      {
        url: SITE.OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${SITE.NAME} Open Graph image`,
      },
    ],
  },
  applicationName: SITE.NAME,
  appleWebApp: {
    title: SITE.NAME,
    statusBarStyle: "default",
    capable: true,
  },
  title: {
    default: SITE.NAME,
    template: `%s | ${SITE.NAME}`,
  },
  description: SITE.DESCRIPTION.LONG,
  formatDetection: {
    address: false,
    email: false,
    telephone: false,
  },
  keywords: [...SITE.KEYWORDS],
  authors: [{ name: SITE.AUTHOR.NAME, url: LINK.TWITTER }],
  creator: SITE.AUTHOR.NAME,
  publisher: SITE.AUTHOR.NAME,
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.NAME} | Motion-Powered React Components`,
    description: SITE.DESCRIPTION.SHORT,
    creator: SITE.AUTHOR.TWITTER,
    site: SITE.AUTHOR.TWITTER,
    images: [SITE.OG_IMAGE],
  },
  category: "technology",
};

export { baseMetadata, createMetadata };
