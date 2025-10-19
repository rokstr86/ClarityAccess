/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["puppeteer-core", "@sparticuz/chromium"],
  },
  eslint: { ignoreDuringBuilds: true } // keeps deploys from blocking on lint
};
export default nextConfig;
