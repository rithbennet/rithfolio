# Rithfolio

A modern, responsive personal portfolio and blog built with Astro, TypeScript, and Tailwind CSS.

## Overview

Rithfolio is a showcase of my professional work, skills, and experience. This portfolio website features a clean, modern design with dark/light mode support, a fully-featured MDX blog, and responsive layouts for all devices.

## Features

- **Responsive Design**: Looks great on desktop, tablet, and mobile devices
- **Dark/Light Mode**: Toggle between dark and light themes
- **MDX Blog**: Full blog with syntax-highlighted code blocks, tag filtering, and search
- **Project Showcase**: Highlight your best work with images and descriptions
- **Skills Section**: Display your technical skills and expertise
- **Contact Form**: Allow visitors to reach out directly (serverless API endpoint)
- **Social Links**: Connect with your professional networks
- **SEO Optimised**: Open Graph, Twitter Cards, JSON-LD structured data, sitemap, robots.txt
- **Comments**: Giscus-powered comments on blog posts

## Tech Stack

- [Astro](https://astro.build/) - Static site generator with islands architecture
- [React](https://react.dev/) - Interactive islands (theme toggle, search, comments, forms)
- [TypeScript](https://www.typescriptlang.org/) - Static type-checking
- [Tailwind CSS v4](https://tailwindcss.com/) - Utility-first CSS framework (CSS-first config, no `tailwind.config.js` or `postcss.config` needed)
- [Astro Icon](https://github.com/natemoo-re/astro-icon) + [Lucide](https://lucide.dev/) - SVG icon library
- [MDX](https://mdxjs.com/) - Markdown with JSX for blog content
- [rehype-pretty-code](https://rehype-pretty.pages.dev/) - Syntax highlighting with dual theme support
- [Giscus](https://giscus.app/) - GitHub Discussions-powered comments
- [Shadcn UI](https://ui.shadcn.com/) - Component library (Button, Card, Badge)

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- pnpm package manager

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/rithbennet/rithfolio.git
   cd rithfolio
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Run the development server:

   ```bash
   pnpm dev
   ```

4. Open [http://localhost:4321](http://localhost:4321) in your browser to see the result.

## Project Structure

```
rithfolio/
├── content/
│   └── posts/         # MDX blog posts (each in its own folder)
├── public/            # Static assets
├── src/
│   ├── components/    # Astro & React components
│   ├── layouts/       # Base HTML layout
│   ├── lib/           # Utility functions
│   ├── pages/         # File-based routing
│   │   ├── api/       # Serverless API endpoints
│   │   └── blog/      # Blog pages & tag pages
│   └── styles/        # Global CSS (Tailwind v4 CSS-first config)
├── astro.config.mjs   # Astro configuration
├── components.json    # Shadcn UI configuration
└── ...
```

## Customization

### Personal Information

Update your personal information and portfolio content in the appropriate components.

### Styling

The project uses Tailwind CSS v4 with CSS-first configuration — all theme tokens and custom styles live in `src/styles/globals.css`. No `tailwind.config.js` or `postcss.config` files are needed.

### Blog

Add new blog posts by creating a folder under `content/posts/` with an `index.mdx` file. See `BLOG_GUIDE.md` for details.

## Deployment

This project is configured for Vercel deployment with the `@astrojs/vercel` adapter:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rithbennet/rithfolio)

## License

MIT

## Contact

Harith - harith.bennett@gmail.com

Project Link: [https://github.com/rithbennet/rithfolio](https://github.com/rithbennet/rithfolio)
