/** @type {import('next').NextConfig} */

// Deploy targets:
//  - GitHub Pages (default here): static export to `out/`, served under /cmih.
//  - Docker: set NEXT_OUTPUT_STANDALONE=true for a self-contained Node server.
const isPages = process.env.GITHUB_PAGES === "true";
const basePath = isPages ? "/cmih" : "";

const nextConfig = {
  output: process.env.NEXT_OUTPUT_STANDALONE === "true" ? "standalone" : "export",
  images: { unoptimized: true }, // required for static export
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true, // stable directory-style URLs on static hosts
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
