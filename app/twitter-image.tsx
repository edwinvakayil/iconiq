import { generateSocialImage } from "@/lib/generate-social-image";
import { OG_IMAGE_ALT, OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH } from "@/seo/og-image";

export const runtime = "nodejs";
export const dynamic = "force-static";
export const revalidate = false;
export const alt = OG_IMAGE_ALT;
export const size = { width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT };
export const contentType = "image/png";

export default function TwitterImage() {
  return generateSocialImage();
}
