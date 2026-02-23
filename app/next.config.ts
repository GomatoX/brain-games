import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
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
