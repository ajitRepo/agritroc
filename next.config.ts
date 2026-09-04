import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enables standalone output for containerized / VPS deployments
  output: process.env.BUILD_STANDALONE === 'true' ? 'standalone' : undefined,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },
};

export default nextConfig;
