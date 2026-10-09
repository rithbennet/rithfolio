// Reads an AI report built by the /report skill (content/reports/<id>.html) and splits it into the parts
// the site renders in its own layout: header facts, body, the report's extra CSS and its scripts.
// The skill's output has a fixed shape (hero header, TREE rail, <main id="body">), so plain string
// matching is enough here.

const sources = import.meta.glob<string>("/content/reports/*.html", { query: "?raw", import: "default", eager: true });

export interface ReportHtml {
  kind: string;
  title: string;
  standfirst: string;
  facts: { label: string; value: string }[];
  toc: { slug: string; text: string }[];
  body: string;
  css: string;
  scripts: string;
}

const decode = (s: string) =>
  s
    .replace(/<[^>]+>/g, "")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .trim();

// the kit's Dracula hexes that reports write straight into markup and CSS
const recolour = (s: string) => s.replace(/#282A36/gi, "var(--bg)").replace(/#191A21/gi, "var(--bg-deep)");

// tokens the site owns: a report redefining these would repaint the whole page
const SITE_TOKENS = /--(bg|surface|ink|body|muted|rule|accent)\s*:[^;}]*;?/g;

export function hasReportHtml(id: string) {
  return `/content/reports/${id}.html` in sources;
}

export function readReportHtml(id: string): ReportHtml {
  const html = sources[`/content/reports/${id}.html`];
  if (!html) throw new Error(`Missing content/reports/${id}.html (the /report skill's output)`);

  const hero = html.slice(html.indexOf('<header class="hero"'), html.indexOf("</header>"));
  const kind = decode(hero.match(/<span class="chip">([\s\S]*?)<\/span>/)?.[1] ?? "Report");
  const title = decode(hero.match(/<h1>([\s\S]*?)<\/h1>/)?.[1] ?? "");
  const standfirst = decode(hero.match(/<p class="standfirst">([\s\S]*?)<\/p>/)?.[1] ?? "");
  const facts = [...hero.matchAll(/<div class="lb">([\s\S]*?)<\/div><div class="vv">([\s\S]*?)<\/div>/g)].map((m) => ({
    label: decode(m[1]),
    value: decode(m[2]),
  }));

  const open = html.match(/<main[^>]*>/);
  const start = (open?.index ?? 0) + (open?.[0].length ?? 0);
  const end = html.indexOf("</main>");
  // assets sit in public/reports/<id>/, so relative links become absolute
  const body = recolour(html.slice(start, end)).replace(
    /\b(src|href|poster)="(?!https?:|#|\/|data:|mailto:)([^"]+)"/g,
    `$1="/reports/${id}/$2"`,
  );

  const toc = [...body.matchAll(/<h2 id="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/g)].map((m) => ({
    slug: m[1],
    text: decode(m[2].replace(/<span class="no">[\s\S]*?<\/span>/, "")),
  }));

  // the site restyles the kit itself (src/styles/article.css), so only what a report adds on top is kept:
  // other <style> blocks, and anything after the kit's last rule (@media (forced-colors…)
  const css = recolour(
    [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)]
      .map(([, block]) => {
        if (!block.includes("/* report kit")) return block;
        const last = block.lastIndexOf("@media (forced-colors");
        return last < 0 ? "" : block.slice(block.indexOf("\n", last) + 1);
      })
      .join("\n"),
  ).replace(SITE_TOKENS, "");

  // the data blobs and the kit runtime (tooltips, charts) come after </main>
  const scripts = [...html.slice(end).matchAll(/<script[\s\S]*?<\/script>/g)].map((m) => m[0]).join("\n");

  return { kind, title, standfirst, facts, toc, body, css, scripts };
}
