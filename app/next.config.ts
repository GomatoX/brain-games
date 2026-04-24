import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: path.resolve(__dirname, ".."),
  },
  async rewrites() {
    return [
      {
        // Serve the Svelte SPA for /play (with any query params)
        source: "/play",
        destination: "/play/index.html",
      },
    ];
  },
};

export default nextConfig;
