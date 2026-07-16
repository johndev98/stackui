import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/photos/**",
      },
    ],
  },
  allowedDevOrigins: ["192.168.1.9"],
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
