import { SITE } from "@/constants";

const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 630;
const OG_IMAGE_ALT = `${SITE.NAME} — Motion-Powered React Components`;

const openGraphImagePath = "/opengraph-image";
const twitterImagePath = "/twitter-image";

function getSocialImageUrl(path: string) {
  return new URL(path, SITE.URL).href;
}

const openGraphImageMetadata = {
  url: getSocialImageUrl(openGraphImagePath),
  secureUrl: getSocialImageUrl(openGraphImagePath),
  width: OG_IMAGE_WIDTH,
  height: OG_IMAGE_HEIGHT,
  type: "image/png" as const,
  alt: OG_IMAGE_ALT,
};

const twitterImageMetadata = {
  url: getSocialImageUrl(twitterImagePath),
  width: OG_IMAGE_WIDTH,
  height: OG_IMAGE_HEIGHT,
  alt: OG_IMAGE_ALT,
};

export {
  getSocialImageUrl,
  OG_IMAGE_ALT,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  openGraphImageMetadata,
  openGraphImagePath,
  twitterImageMetadata,
  twitterImagePath,
};
