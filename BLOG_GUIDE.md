# Writing a diary entry

Entries live in `content/posts/<slug>/index.mdx` and are served at `https://rith.dev/blog/<slug>`.

## Quick start

1. Make a folder `content/posts/my-entry/` (the folder name is the URL slug: lowercase, hyphenated).
2. Add `index.mdx` with the frontmatter below.
3. Put any images in the same folder.
4. Run `pnpm dev` and open `/blog/my-entry`.

Before publishing, run `pnpm lint` (Biome errors plus `astro check`).

```
content/posts/my-entry/
├── index.mdx
├── cover.jpg        # the image head (optional)
└── screenshot.png   # images used in the text
```

## Frontmatter

```yaml
---
title: "A week of letting agents run the night shift"
description: "One or two sentences. Shown under the title, in the feed and in link previews."
date: 2026-10-08
cover: ./cover.jpg
coverAlt: "What the image shows, for screen readers"
coverCaption: "Optional line under the image"
location: "Kuala Lumpur"
tags: [agents, dagangnow]
reports: [puck-orchestration]
published: true
---
```

| Field          | Required | What it does                                                                 |
| -------------- | -------- | ---------------------------------------------------------------------------- |
| `title`        | yes      | Entry title                                                                  |
| `description`  | yes      | The standfirst under the title, the feed text and the SEO description        |
| `date`         | yes      | `YYYY-MM-DD`                                                                 |
| `cover`        | no       | Image head, relative to the entry folder. Also used as the link-preview image |
| `coverAlt`     | no       | Alt text for the cover. Leave empty only if the image is purely decorative   |
| `coverCaption` | no       | Small mono caption under the cover                                           |
| `location`     | no       | Shown in the header row                                                      |
| `tags`         | no       | Lowercase, hyphenated (`machine-learning`). Shown under the header image; each gets a `/blog/tag/<tag>` page listing entries and reports |
| `reports`      | no       | Ids of AI reports this entry discusses                                       |
| `published`    | no       | `false` keeps it out of the feed and the build. Drafts still open at their URL in `pnpm dev` |

The header is one row, `Diary · date · reading time · location`, above the title. Tags and the series line sit under the header image, or under the header when there's no image. Reading time is calculated. AI reports use the same header and layout.

## Image heads

Add `cover: ./cover.jpg`. The cover sits under the header at the width of the text and is always cropped to 16:9 from the centre. The latest entry's cover on `/blog` uses the same crop.

- Use a landscape 16:9 image at least **1400 px wide**. Astro resizes it and serves WebP, so the original can be larger.
- Keep the subject near the middle; the edges are what get cropped. The link-preview copy is 1200 px wide.

## Writing

Diary entries and AI reports share one layout and one set of components, so anything a report shows can go in an entry too.

- `##` headings become numbered sections (`01`, `02`, …) and fill the contents rail on the left. The rail appears once an entry has two or more `##` headings. Use `###` for sub-points; they aren't numbered.
- Numbered lists get `01`-style markers.
- Tables are plain Markdown and get the reports' styling. Wide ones scroll on small screens.
- Images in the text: `![Alt text](./screenshot.png)`. Astro optimises these too.
- Code blocks: put the language after the backticks (```` ```ts ````). Add `title="file.ts"` for a filename and `{1,3-5}` to highlight lines.
- On wide screens, tables, cards and side-by-side cards stretch into the empty right margin.

### Components

No imports needed:

```mdx
<KeyPoints>
1. **Cost.** The night cost about $147 at API list prices.
2. **Delivered.** Three of 31 tasks merged.
</KeyPoints>

<Note kind="key" label="Takeaway">The weekly limit decides how fast this goes.</Note>

<Stats items={[
  { label: "Tasks merged", value: "3 of 31", note: "the rest waited on review" },
  { label: "Output tokens", value: "2.21M" },
]} />

<Card title="Spend by agent" sub="API-equivalent, sorted by cost">
  <Bars items={[
    { label: "Orchestrator", note: "Opus 5.5", value: 90.17, display: "$90.17", color: "c1" },
    { label: "Coders", note: "Sonnet 5.5", value: 27.71, display: "$27.71", color: "c2" },
  ]} />
  <Data>

| Group | Calls | Cost |
| --- | --- | --- |
| Orchestrator | 681 | $90.17 |

  </Data>
</Card>

<Report id="puck-orchestration" />
```

| Component   | What it is                                                                                           |
| ----------- | ---------------------------------------------------------------------------------------------------- |
| `KeyPoints` | Wraps a Markdown list as numbered rows between rules, like a report's "Bottom line"                  |
| `Note`      | A side note with a rule down the left. `kind`: `plain` (default), `key`, `warn` or `bad`. `label` is optional |
| `Stats`     | Headline numbers as tiles. `cols` sets tiles per row (default 4)                                     |
| `Bars`      | Horizontal bars scaled to the largest value (or `max`). `color`: `c1`–`c5` or `neutral`              |
| `Card`      | A boxed figure with an optional `title` and `sub`. Put two in `<div class="grid2">` to sit them side by side |
| `Data`      | A collapsed "View the data" section (`label` to rename it). Leave blank lines around Markdown inside |
| `Report`    | An AI report as a taped clipping                                                                     |

The reports' own HTML classes (`.finding`, `.recs`, `.pill`, `.legend`, …) also work in MDX if you need something the components don't cover. Line charts are the one thing that only reports have so far.

## AI reports

Reports render on the same layout as entries, in the site's fonts and colours.

1. **Add the report.** Save the `/report` skill's HTML as `content/reports/<id>.html`. Put any images and videos it links to in `public/reports/<id>/`. Then add `content/reports/<id>.md` with `title`, `date`, `kind`, `model`, `readingTime`, `summary`, up to four `highlights` and `tags`. It's served at `/reports/<id>/`, shows on `/blog#reports` and appears on its tag pages.
2. **Reference it from an entry.** List the id under `reports:`. The clipping appears under "Discussed in this entry", and the report page lists the entry under "Referenced in".
3. **Embed it mid-entry (optional).** `<Report id="<id>" />` wherever it belongs.

The page takes the report's title, standfirst, reading time and body from the HTML. The skill's Dracula colours are swapped for the site's, so the HTML doesn't need editing.

Reports are published as is, so read them for internal details first.

## Series

When entries and reports belong together in order (a diary entry, the report it led to, then a follow-up), make a series:

```yaml
# content/series/night-shift.md
---
title: "The night shift"
description: "Letting agents run DagangNow overnight, the report on what happened, and what I changed."
parts:
  - diary: night-shift
  - report: puck-orchestration
  - diary: what-i-changed
---
```

`parts` is the reading order: `diary:` takes an entry's folder name and `report:` a report id. Nothing changes in the entries themselves. Each part then shows:

- "Part 2 of 3 · The night shift →" under the header, linking to the series page at `/blog/series/<id>`
- the full list of parts in the left rail, with the current one highlighted
- links to the previous and next part at the end

Drafts drop out of the numbering until they're published. A misspelt id fails the build with the series name in the error.

## Troubleshooting

- **Entry not listed:** check `published` and the date format, then restart `pnpm dev`.
- **Image not found:** paths are relative to the entry folder (`./cover.jpg`) and case-sensitive.
- **Build error on frontmatter:** run `pnpm lint`. The schema is in `src/content.config.ts`.
