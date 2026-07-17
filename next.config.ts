import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  // ✅ Bỏ .md/.mdx khỏi pageExtensions - không dùng @next/mdx nữa
  pageExtensions: ["js", "jsx", "ts", "tsx"],
  productionBrowserSourceMaps: false, // Giữ tắt source map
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
  // ✅ Next 16 dùng turbopack (không còn experimental.turbo nữa)
  turbopack: {
    rules: {
      // ✅ Bảo Turbopack: nếu có ai tình cờ import .md/.mdx -> coi là text thôi, đừng báo lỗi
      "*.md": { as: "*.txt" },
      "*.mdx": { as: "*.txt" },
    },
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
