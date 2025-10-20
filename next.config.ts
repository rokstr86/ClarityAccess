/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["puppeteer-core", "@sparticuz/chromium"],
  eslint: { ignoreDuringBuilds: false } // Enable lint checks during builds for production quality
};
export default nextConfig;
