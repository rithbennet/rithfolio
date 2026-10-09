import type { APIRoute } from "astro";

// Search Console and most tools look for /sitemap.xml, but @astrojs/sitemap writes sitemap-index.xml.
// Serve the same index here so both addresses work.
export const GET: APIRoute = ({ site }) => {
  const body = `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${new URL("/sitemap-0.xml", site)}</loc></sitemap></sitemapindex>`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml" },
  });
};
