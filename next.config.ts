import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async rewrites() {
    return [
      // shadcn CLI expects registry at root; serve from /r/registry.json
      { source: "/registry.json", destination: "/r/registry.json" },
      // item URLs at root (e.g. /arrow-down-1-0.json) → /r/arrow-down-1-0.json
      { source: "/:name.json", destination: "/r/:name.json" },
    ];
  },
};

export default nextConfig;
