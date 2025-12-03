# Blog Creation Guide

This guide explains how to create and manage blog posts for rith.dev.

## Quick Start

1. Create a new folder in `content/posts/` with your post slug (URL-friendly name)
2. Add an `index.mdx` file inside that folder
3. Add your images to the same folder
4. Run `pnpm dev` to see your post

## File Structure

```
content/
└── posts/
    └── my-awesome-post/           # Folder name = URL slug
        ├── index.mdx              # Your blog content
        ├── cover.jpg              # Cover image (optional)
        ├── screenshot-1.png       # Additional images
        └── diagram.svg            # Any image format works
```

Your post will be accessible at: `https://rith.dev/blog/my-awesome-post`

## Frontmatter Template

Every `index.mdx` file must start with frontmatter (YAML between `---` markers):

```yaml
---
title: "Your Post Title"
description: "A brief description for SEO and previews (150-160 characters ideal)"
date: "2024-01-15"
tags:
  - nextjs
  - react
  - typescript
image: "./cover.jpg" # Optional: relative path to cover image
published: true # Set to false to hide from listing
---
```

### Frontmatter Fields

| Field         | Required | Description                                      |
| ------------- | -------- | ------------------------------------------------ |
| `title`       | ✅       | Post title (shown in browser tab and listings)   |
| `description` | ✅       | SEO description and preview text                 |
| `date`        | ✅       | Publication date (YYYY-MM-DD format)             |
| `tags`        | ✅       | Array of lowercase tags for categorization       |
| `image`       | ❌       | Relative path to cover image                     |
| `published`   | ❌       | Set to `false` to hide post (defaults to `true`) |

## Writing Content

After the frontmatter, write your content using MDX (Markdown + JSX):

````mdx
---
title: "Building a REST API with Node.js"
description: "Learn how to build a scalable REST API using Node.js and Express"
date: "2024-01-15"
tags:
  - nodejs
  - api
  - tutorial
image: "./cover.png"
published: true
---

Welcome to this tutorial! Let's build something amazing.

## Introduction

This is a paragraph with **bold** and _italic_ text.

## Code Examples

Here's some JavaScript:

\`\`\`javascript title="server.js"
const express = require('express');
const app = express();

app.get('/api/hello', (req, res) => {
res.json({ message: 'Hello World!' });
});

app.listen(3000);
\`\`\`

## Adding Images

![Screenshot of the app](./screenshot-1.png)

## Links

Check out [Next.js docs](https://nextjs.org/docs) for more info.

## Linking To Other Posts

You can link to other posts in a few simple ways:

- Direct link using the post slug:

  ```mdx
  See my previous post on [TypeScript tips](/blog/typescript-tips).
  ```
````

- Relative links also work from anywhere:

  ```mdx
  Read more in [Hello World](/blog/hello-world).
  ```

- Use tags pages to cross-reference topics:

  ```mdx
  Explore more posts tagged **nextjs** at [/blog/tag/nextjs](/blog/tag/nextjs).
  ```

Tips:

- Keep slugs lowercase and hyphenated (`my-awesome-post`).
- Verify target post exists and is `published: true`.
- For long series, add a "Series" section linking parts 1, 2, 3.

`````

## Code Block Features

### Syntax Highlighting

Specify the language after the opening backticks:

````mdx
```typescript
const greeting: string = "Hello, World!";
`````

`````

Supported languages: `javascript`, `typescript`, `jsx`, `tsx`, `python`, `bash`, `json`, `css`, `html`, `sql`, `go`, `rust`, and many more.

### Adding a Title

Add `title="filename.ts"` to show a filename header:

````mdx
```typescript title="utils.ts"
export function formatDate(date: Date): string {
  return date.toLocaleDateString();
}
```
`````

### Highlighting Lines

Highlight specific lines with `{1,3-5}`:

````mdx
```javascript {1,3-5}
import express from "express"; // highlighted
const app = express();
app.get("/", (req, res) => {
  // highlighted
  res.send("Hello"); // highlighted
}); // highlighted
```
````

## Image Guidelines

### Recommended Sizes

| Image Type     | Recommended Size        | Notes                                                  |
| -------------- | ----------------------- | ------------------------------------------------------ |
| Cover/OG Image | **1200 × 630 px**       | Used for social sharing (Twitter, LinkedIn, etc.)      |
| Content Images | **800 - 1200 px** width | Max width in blog is ~768px, but provide 2x for retina |
| Screenshots    | **1600 px** max width   | Retina-ready, will be scaled down                      |
| Diagrams/SVGs  | Any size                | SVGs scale perfectly                                   |

### Image Formats

- **JPG**: Best for photos, smaller file size
- **PNG**: Best for screenshots, diagrams with text
- **WebP**: Best compression, modern format
- **SVG**: Best for diagrams, icons, logos

### Using Images

**Option 1: Markdown syntax (simple)**

```mdx
![Alt text description](./my-image.png)
```

**Option 2: Next.js Image component (optimized)**

```mdx
import Image from "next/image";
import screenshot from "./screenshot.png";

<Image
  src={screenshot}
  alt="Description of the image"
  width={800}
  height={450}
  placeholder="blur"
/>
```

### Image Optimization Tips

1. **Compress images** before adding them (use [squoosh.app](https://squoosh.app))
2. **Use WebP format** for best compression
3. **Keep file sizes under 500KB** ideally
4. **Always add alt text** for accessibility and SEO

## Tags Best Practices

- Use lowercase, single-word tags: `react`, `nextjs`, `typescript`
- Use hyphens for multi-word concepts: `machine-learning`, `web-development`
- Be consistent: always use `nextjs` not sometimes `next.js` or `Next`
- Limit to 3-5 tags per post

### Common Tags

```yaml
tags:
  - react
  - nextjs
  - typescript
  - javascript
  - nodejs
  - css
  - tailwindcss
  - tutorial
  - guide
  - web-development
  - api
  - database
  - devops
  - productivity
```

## SEO Checklist

- [ ] Title is under 60 characters
- [ ] Description is 150-160 characters
- [ ] Cover image is 1200×630 px
- [ ] All images have alt text
- [ ] Post has 3-5 relevant tags
- [ ] URL slug is descriptive and short
- [ ] Content has proper heading hierarchy (H2, H3, etc.)

## Draft Posts

To save a draft without publishing:

```yaml
---
title: "Work in Progress"
published: false
---
```

The post won't appear in listings but can be previewed at its direct URL during development.

## Example Post Structure

```
content/posts/building-a-blog-with-nextjs/
├── index.mdx
├── cover.png           # 1200x630 for social sharing
├── architecture.svg    # Diagram
├── screenshot-1.png    # Demo screenshot
└── screenshot-2.png    # Another screenshot
```

```mdx
---
title: "Building a Blog with Next.js and Contentlayer"
description: "Learn how to create a modern MDX blog with Next.js 15, Contentlayer, and Tailwind CSS"
date: "2024-01-20"
tags:
  - nextjs
  - mdx
  - tutorial
image: "./cover.png"
published: true
---

Your amazing content here...

![Architecture Overview](./architecture.svg)

More content...

![Final Result](./screenshot-1.png)
```

## Troubleshooting

### Post not showing up?

1. Check `published: true` in frontmatter
2. Verify the date format is correct (YYYY-MM-DD)
3. Restart the dev server (`pnpm dev`)

### Images not loading?

1. Verify the path is relative (`./image.png`)
2. Check the file exists in the post folder
3. File names are case-sensitive

### Build errors?

1. Check frontmatter syntax (proper YAML)
2. Ensure all required fields are present
3. Run `pnpm contentlayer build` to see detailed errors

---

Happy writing! 🚀
