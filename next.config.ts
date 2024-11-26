import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ncya3fapxw4o2nm3.public.blob.vercel-storage.com"
      }
    ]
  }
};

export default nextConfig;
