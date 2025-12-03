import { NextResponse } from "next/server";

export function GET() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://rithfolio.vercel.app";

  const body = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml`;

  return new NextResponse(body, {
    headers: { "content-type": "text/plain" },
  });
}
