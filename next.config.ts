import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "hatscripts.github.io" },
    ],
  },
};

export default nextConfig;
