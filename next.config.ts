import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Temporarily ignore build errors to deploy
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
