import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "iconiqui.com",
        pathname: "/assets/**",
      },
    ],
  },
};

export default nextConfig;
