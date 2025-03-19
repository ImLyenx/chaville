import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "kdog16zdet.ufs.sh",
      },
    ],
  },
};

export default nextConfig;
