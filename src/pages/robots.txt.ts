import type { APIRoute } from "astro";

export const GET: APIRoute = () => {
  const baseUrl = import.meta.env.SITE_URL || "https://rith.dev";

  const body = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap-index.xml`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain" },
  });
};
