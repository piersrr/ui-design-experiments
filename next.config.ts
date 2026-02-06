import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  // Use /tabs/index.html instead of tabs.html so shared hosts serve /tabs/ reliably.
  // Reduces 403 on second visit when server or ModSecurity treats requests differently.
  trailingSlash: true,
};

export default nextConfig;
