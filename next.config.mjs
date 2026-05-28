/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export — Cloudflare Pages serves the resulting /out folder from
  // its edge with zero server cost. No need for @cloudflare/next-on-pages
  // because nothing on this site requires a runtime (no API routes, no
  // dynamic params, no server components doing data fetches).
  output: "export",
  // next/image's optimizer needs a server, so disable it for export.
  // Plain <img> tags + /public assets still work normally.
  images: { unoptimized: true },
  // Generates /about/index.html instead of /about.html — Cloudflare Pages
  // routes that pattern by default.
  trailingSlash: true,
};

export default nextConfig;
