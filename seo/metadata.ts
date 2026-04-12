import type { Metadata } from "next";

import { LINK, SITE } from "@/constants";

type CreateMetadataOptions = {
  title?: string;
  description?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  noIndex?: boolean;
};

const createMetadata = (options: CreateMetadataOptions = {}): Metadata => {
  const {
    title,
    description = SITE.DESCRIPTION.SHORT,
    canonical,
    ogTitle,
    ogDescription,
    noIndex = false,
  } = options;

  return {
    ...(title && { title }),
    description,
    ...(canonical && {
      alternates: {
        canonical,
      },
    }),
    openGraph: {
      title: ogTitle || title || SITE.NAME,
      description: ogDescription || description,
      url: canonical ? `${SITE.URL}${canonical}` : SITE.URL,
      type: "website",
    },
    twitter: {
      title: ogTitle || title || SITE.NAME,
      description: ogDescription || description,
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
};

const baseMetadata: Metadata = {
  metadataBase: new URL(SITE.URL),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: SITE.NAME,
    description: SITE.DESCRIPTION.SHORT,
    siteName: SITE.NAME,
    type: "website",
    locale: "en_US",
    url: SITE.URL,
  },
  applicationName: SITE.NAME,
  appleWebApp: {
    title: SITE.NAME,
    statusBarStyle: "default",
    capable: true,
  },
  title: {
    default: `${SITE.NAME} | Free Motion-Powered Icons and Components Library`,
    template: `%s | ${SITE.NAME}`,
  },
  description: SITE.DESCRIPTION.LONG,
  keywords: [...SITE.KEYWORDS],
  authors: [{ name: SITE.AUTHOR.NAME, url: LINK.TWITTER }],
  creator: SITE.AUTHOR.NAME,
  publisher: SITE.AUTHOR.NAME,
  twitter: {
    card: "summary_large_image",
    title: `${SITE.NAME} | Free Motion-Powered Icons and Components`,
    description: SITE.DESCRIPTION.SHORT,
    creator: SITE.AUTHOR.TWITTER,
    site: SITE.AUTHOR.TWITTER,
  },
  category: "technology",
};

export { baseMetadata, createMetadata };
