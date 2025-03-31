import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "uchronia-backend.deploymate.xyz",
      },
    ],
  },
};

export default nextConfig;
