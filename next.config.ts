import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  reactCompiler: true,
  async headers() {
    return [
      {
        source: "/r/:path*.json",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=0, s-maxage=31536000, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "iconiqui.com",
        pathname: "/assets/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
