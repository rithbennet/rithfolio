# Design extraction: reference sites

> Extracted 7 Oct 2026 from the live sites. Direction: **Mohtasham's restraint + Rashad's pixel self.**
> Local screenshots: `docs/design/refs/` (gitignored, since they show other people's sites and assets).

| Ref | URL | Stack | Role in our redesign |
| --- | --- | --- | --- |
| Mohtasham | https://www.mohtasham.dev | Next.js, CSS modules + Tailwind | **Primary system**: palette, type, layout, motion, blog + report format |
| Rashad | https://www.mfrashad.com | **Astro** islands + Tailwind | **One borrowed device**: the pixel-art sprite of himself |
| Ray | _URL needed_ | — | Information architecture only (pending) |

---

## 1. Mohtasham (mohtasham.dev): the base system

### 1.1 The idea in one line

A warm paper desk. Text is set like a printed letter, and **real objects lie on the desk** (camera, skis, watch, name tag, sticky note). Each object stands for a piece of his identity. The objects are the only loud thing; everything else is quiet type on paper.

### 1.2 Palette

| Token | Value | Use |
| --- | --- | --- |
| `--site-paper` | `#f3f0e8` | Page background (warm off-white, HSL `44 31% 93%`) |
| ink | `#24231f` / `#292722` | Headings, nav, primary text |
| body-muted | `#777269` | Small UI paragraphs (Manrope 12.8px/500) |
| article body | `rgb(101 97 90)` ≈ `#65615a` | Long-form paragraphs |
| label-grey | `#8a857b` | Mono labels ("DRAG THE OBJECTS AROUND") |
| label-rust | `#9a7461` | Section eyebrows ("LATEST WRITING", "HAVE SOMETHING IN MIND?") |
| **accent orange** | `#dc713d` | Active nav, logo, links, CTA outlines |
| pencil orange | `#e69a76` / `rgb(237 154 120)` | Highlighter swash behind a word, nav squiggle |
| stamp red | `rgba(177 79 48 / .62)` | "DO NOT OPEN EARLY" stamp |
| selection | `#9e542f` bg / `#f4eedb` text | `::selection` |
| sticky-note yellow | `#f3d68e` | Contact note |
| letter paper | `#f2eddf` | Time-capsule letter |
| chart teal | `#41697c` | Primary chart series (study posts) |
| chart sage / mauve / ochre | `#68786a` / `#80658c` / `#a07347` | Other chart series |
| chart error | `#ad6554` | "Wrong" bars (hatched with `#f4d4c4`) |
| chart deferred / track | `#dcd7cd` / `#ede9e0` | Neutral fills |

Chart bars in the study post use **desaturated** colours (slate blue, sage, ochre-brown, plum), never bright UI colours. The `--report-*` variables in his CSS are **orphaned** (left over from an old "field report" edition of the site), so ignore them. There is no dark mode.

### 1.3 Type: four families, each with one job

| Family | Role | Observed settings |
| --- | --- | --- |
| **Instrument Serif** 400 | All headings, the hero statement | h1 37px / lh 1.08 / tracking `-0.018em`; h2 41–58px, tracking `-0.025em`; condensed, newspaper feel |
| **Manrope** 200–800 | UI, nav, small body, article body | nav 14px/400; UI body 12.8–13px/500, tracking `-0.01em`; blog excerpts ~15px |
| **IBM Plex Mono** 400/500 | Metadata eyebrows, stamps, dates | 8–10px, UPPERCASE, tracking `0.08–0.12em` |
| **Caveat** 400–700 | Handwriting: the letter, project names, "Write to me", timeline labels | — |
| EB Garamond | Loaded as `--font-editorial`; editorial body option | — |

Rule: **the serif speaks, the sans explains, the mono labels, the hand annotates.**

### 1.4 Layout

- Header: 3 columns. Logo mark at left (42px tile), **nav centred** (Home · Work · Blog · About), socials at right (X, GitHub, LinkedIn, 31px icon buttons). It is not sticky on long pages.
- Reading column: **672px** (`max-w-2xl`) for About, Blog and articles. Figures in the report break out to **768px**.
- Home is full-bleed: each section is `100vh`, and objects sit on the desk with free absolute positioning.
- Vertical rhythm: large gaps between sections (whole viewports on Home; ~120–160px on inner pages).
- No cards, borders or shadows on text. Shadows only on **physical objects** (soft, diffuse, offset down).

### 1.5 Signature components

1. **Desk-object hero** (`HeroExperience`). Eight transparent-PNG cut-outs (MacBook, Fujifilm X-T5, Seiko watch, skis, sunflower, "Hello my name is" sticker, Oikina badge, a monitor that **plays a looping Valorant clip**). Each one is:
   - `role="img"` with a descriptive `aria-label` ("A pair of alpine skis, draggable decoration") and `tabindex=0`
   - draggable with pointer events (`touch-action:none`, `user-select:none`)
   - given an **entrance**: it starts off-screen (`translateX(±48vw) translateY(±34vh) scale(.78)`, `opacity:0`) and flies in to a resting position with a slight rotation
   - accompanied by the hint "DRAG THE OBJECTS AROUND" (mono 10px) in the bottom-right corner
   - The objects double as a **hobby inventory**: skiing, gaming, photography, watches.
2. **Hero statement.** One serif sentence, centred: "I'm Mohtasham, a ~~founder~~ and AI engineer, exploring how AI can change the way we live." One word gets a **pencil highlighter**: an `::before` pill in `#ed9a78`, rotated `-1deg`, radius ~5.5px, behind the text. Below it: a Manrope 12.8px line ("Currently based in 📍 Kuala Lumpur. AI Engineer at **CitySage**.") and a plain "Email me" link.
3. **Future letter** (`FutureLetter`). A paper sheet with a strip of black tape, mono eyebrow "WRITTEN AUG 23, 2026 · OPEN AUG 23, 2036", serif title, body in **Caveat handwriting**, a signature, and a rotated stamp box "DO NOT OPEN EARLY". Props beside it: a lanyard ID card ("Malaysian AI resident") and a pencil with shavings. It adds a lot of personality in one block.
4. **Project collage** (`ProjectCollage`). Each project appears as a **physical artifact**: a torn-paper design board, a lanyard badge, a scroll of paper. The artifacts are staggered left and right down the page and slightly rotated, with a **Caveat title** and a tiny Manrope one-liner under each. There are no cards or grid.
5. **Latest writing.** A mono eyebrow, then one huge serif title link, then "Read the article →".
6. **Contact.** A hand-drawn dashed divider, the eyebrow "HAVE SOMETHING IN MIND?", a serif two-liner, and a **yellow sticky note** reading "Say hello" in Caveat. The note has a curled corner and an arrow annotation "Write to me" in rust. The footer is one line of 9–10px Manrope.
7. **Nav active state.** The text turns orange (`#dc713d`) with a **hand-drawn squiggle underline** (`#e69a76`).
8. **Logo.** A small "M" glyph that **assembles from dots** on load (`logo-assemble`, with staggered `--blob-delay` 10–180ms), then periodically jitters or cycles (`logo-blob-cycle`, `logo-jitter`).

### 1.6 Page anatomy

**About** (`/about`), 672px column:
1. A hero object: an open **notebook on a cutting mat**, taped passport photo, handwritten "Kashmir to Kuala Lumpur" and date.
2. "Hi, I'm Mohtasham." (serif) and "Updated Aug 27, 2026" (tiny grey).
3. A pull quote in italic serif, with **one phrase circled by a hand-drawn orange ellipse** ("Microsoft Paint").
4. "About me" with a **drop cap**, then Manrope paragraphs full of inline links.
5. Sections: From Kashmir to KL → What I'm doing now → Events → Looking ahead.
6. **"How I got here"**: an SVG **winding dashed path** (`#7ba1a0`, dash 7/7) that **draws itself as you scroll**. Small orange × marks mark milestones, with Caveat labels. A glowing dot travels the path (`animateMotion` 11s), ending at an orange flag: "Now, still tinkering".
7. "Away from work": hobbies written as plain prose (Valorant mains, skiing in Gulmarg).
8. **Photo orbit**: 9 personal photos as 88px tiles that **slowly orbit** a centre (`circling` 10s linear, radius 160px), pausing on hover. Clicking one opens a **polaroid lightbox** (blurred dark backdrop, Caveat caption, mono counter).
9. Sign-off ("Still building. / Mohtasham / August 2026"), plus links to "favourite books" and "look around my house".

**Work** (`/work`):
1. "Featured work": the flagship as one big artifact (Oikina badge) with name and status ("Building now").
2. A 3×2 grid of smaller artifacts with name and date.
3. "Archive": rows of *Name · CATEGORY IN MONO CAPS · Year*, 67px tall, full 672px width.
4. "Portfolio time capsule": old versions of his own site as "editions" (EDITION 01: plain portfolio; EDITION 02: field report).

**Blog** (`/blog`):
1. "Writing" (serif).
2. The latest post featured: cover image, serif title, date, excerpt, and an orange **outlined pill** "Continue reading →".
3. "All Blogs": compact rows (title, date), 44px tall.

**Study post** (`/blog/jev-vs-a-fast-llm`). It is a normal blog article with 15 embedded figures and 13 tables, not a separate "reports" section. This is the format to copy for your **AI reports**:
- Opening blockquote: an update note dated "Fresh validation, Sept 22", with links to the follow-up and to **a PDF technical report** (`/research/*.pdf`).
- A row of artifact links: "Code and data on GitHub · Download the experiment".
- Numbered method steps (h3 "1. … 7.").
- `figure` blocks (768px): a title, a one-line caption, then a **custom chart** (horizontal bars with 95% CI whiskers, a mono % value on the right) or an SVG plot.
- **Tabs** above a figure to switch the metric ("Median / typical | 95th percentile").
- A **callout** under the chart ("Points below the diagonal indicate overconfidence.").
- **`<details>` "View the data"** under every chart, holding the raw table.
- Plain tables with 1px rules.
- Every claim links to the exact commit, file or dataset.

### 1.7 Motion inventory

- Desk objects: fly-in entrance, then a drag with spring settle (details in §4).
- Logo: dots assemble on load, then a periodic cycle and micro-jitter.
- `fadeIn`: `translateY(-10px)` → 0 with opacity.
- Monitor: video loop, plus a `screenSweep` glare (`translate(-130%)` → `130%`).
- Page transitions (`PageTransition` module).
- **`prefers-reduced-motion`**: animations off. ⚠️ Their bug: the objects stay at `opacity:0`, so reduced-motion users see an empty desk. **We must render the final resting state when motion is reduced.**

---

## 2. Rashad (mfrashad.com): the pixel self

### 2.1 What to borrow: the sprite

A **pixel-art version of himself** appears across the site. Each pose matches the section it sits in:

| Pose (aria-label) | Where it appears | Sheet |
| --- | --- | --- |
| standing idle | Hero, beside the bio | `idle_standing_2f_800ms_sprite_114x159.webp` |
| waving hello | Inline at the end of "Hello, I'm Rashad" | `waving_hello_3f_400ms_sprite_108x139.webp` |
| taking photos | Media mentions | `taking_photos__holding_camera__2f_800ms_…` |
| drinking coffee | Speaking | `drinking_coffee__standing_with_mug__3f_400ms_…` |
| creating content | Content creation | `content_creating__with_tripod_and_camera_2f_800ms_…` |
| coding at computer | Projects | `coding__at_computer_with_monitor__2f_800ms_…` |
| watching movies | Hobbies | `watching_movies__sitting_on_couch__3f_400ms_…` |
| reading a book | Books | `reading_a_book__holding_book__3f_400ms_…` |

**Implementation (copied from his CSS):**

```css
/* file name encodes the metadata: {pose}_{frames}f_{ms-per-frame}ms_sprite_{w}x{h}.webp */
.sprite-idle {
  width: 57px; height: 79.5px;                 /* frame rendered at 0.5x */
  background: url(/sprites/idle_standing_2f_800ms_sprite_114x159.webp) no-repeat;
  background-size: 114px 79.5px;               /* frames × width */
  image-rendering: pixelated;                  /* keep pixels crisp */
  transform-origin: center bottom;
}
.sprite-idle.is-playing  { animation: sprite-idle-play 1600ms steps(2) forwards; }   /* frames × ms */
.sprite-idle.is-squished { animation: sprite-squish 300ms ease-out forwards; }
@keyframes sprite-idle-play { to { background-position-x: -114px; } }
@keyframes sprite-squish {               /* squash & stretch on click/drag */
  0% { transform: scale(1,1) } 30% { transform: scale(1.06,.94) }
  60% { transform: scale(.97,1.03) } 100% { transform: scale(1,1) }
}
@media (prefers-reduced-motion: reduce) {
  .sprite-idle.is-playing, .sprite-idle.is-squished { animation: none; background-position-x: 0; }
}
```

- The sprite is a draggable element: `role="img"`, `aria-label`, `tabindex=0`, `cursor-grab`, `touch-action:none`.
- It plays **once** when triggered (hover, enter viewport, click). It does not loop forever, which keeps it calm.
- Easter egg: `.party-mode` applies `hue-rotate` over 1s plus a 0.1s shake on children.
- Art style: about 60×80 px per frame, chunky outline, 2–3 frames per pose, white shirt, dark trousers, simple face.

### 2.2 Other things worth noting

- **Bio length slider** (`input[type=range]`, 0–19, label "Bio length" in mono): the reader picks how long the bio is. It's a nice idea, but optional.
- Header: a **handwritten wordmark** "rashad" (LiebeHeide) with a tiny face icon, and **UPPERCASE Fira Mono nav** (14px, tracking 1.4px).
- Hero: a collage behind the title (newspaper clippings, Kindle, vinyl record, polaroids of himself).
- Hand-drawn doodles in the margins: a squiggle at top-right and an arrow at left.
- Type: **Apercu** (sans, 700 for h2 at 56px), Fira Mono, LiebeHeide (hand). Background pure `#fff`.
- His bio links each hobby to its own page (`/hobbies`, `/diving`, `/books`, `/movies`). `/hobbies` lists **91 hobbies**, filterable by category and tagged Passionate / Hobbyist / Beginner / Explored.

### 2.3 What to leave out

The density: many top-level pages, stats and metrics, a "Work with me" services grid, press logos, a carousel. Also the pure white background and the Apercu headings, which fight Mohtasham's paper-and-serif feel.

---

## 3. Ray: pending

Ray's site is in the brief (personal nav mixing work, writing, photography and collections), but I couldn't identify the URL. **Needed from Harith.**

---

## 4. Exact CSS values (from Mohtasham's stylesheets)

These were decoded from his production CSS and JS. He uses framer-motion for the hero, drag and page fade.

### 4.1 Type scale (all serif headings are weight 400)

| Element | Size | lh | tracking |
| --- | --- | --- | --- |
| Hero h1 | `clamp(34px, 2.9vw, 44px)` (mobile `clamp(34px, 9.8vw, 45px)`) | 1.08 | -0.018em |
| Section h2 (latest writing) | `clamp(36px, 4.5vw, 64px)` | 0.98 | -0.025em |
| Work h1 | `clamp(38px, 4vw, 54px)` | 1 | -0.02em |
| Blog h1 | `clamp(34px, 4vw, 44px)` | 1.02 | -0.025em |
| Article h1 | `clamp(30px, 3.2vw, 38px)` | 1.08 | -0.025em |
| About h1 | `clamp(28px, 3vw, 36px)` | 1 | -0.03em |
| Article h2 / h3 | `clamp(24px, 3vw, 30px)` / 21px | 1.15 / 1.25 | -0.02em |
| About pull quote | serif italic `clamp(22px, 2.6vw, 30px)` | 1.18 | |
| **Article body** | **Manrope 15px, `#55524c`, justified + `hyphens:auto`, `margin 0 0 1.25em`** | 1.72 | |
| About body | Manrope 14px `#5d5952`, 24px paragraph gap | 1.78 | |
| Drop cap | serif 42px, `margin:7px 4px 0 0` | 0.7 | |
| Mono eyebrow | Plex Mono 10px uppercase `#9a7461` | | 0.12em |
| Sticky note | Caveat 67px / 600 | 0.72 | |
| Letter body | Caveat `clamp(15px, min(1.35vw, 2vh), 20px)` / 500 | 1.25 | |
| Collage caption | Caveat `clamp(30px, 2.8vw, 47px)` / 600 + Manrope `clamp(10px, .78vw, 13px)` | 1 | |

### 4.2 Layout

- Reading column: `width: min(42rem, 100% - 48px)`, or `min(100% - 32px, 35rem)` at ≤720px. Main breakpoint is **720px**.
- Breakout figures and code: `width: min(52rem, 100vw - 48px); position: relative; left: 50%; transform: translate(-50%)`.
- Page top padding is 88px (72px on mobile). Bottom padding is 96–150px.
- Header: `grid-template-columns: 1fr auto 1fr; padding: 24px 28px; position: absolute`. On mobile it becomes `auto 1fr` and the socials are hidden. Nav gap is `clamp(20px, 3vw, 40px)`.
- Home sections each have `min-height: 100svh`. The collage section is `height: clamp(2700px, 320svh, 3600px)`, with artifacts absolutely positioned by %.

### 4.3 Recipes

**Grain overlay** (on every page; the main reason the paper feels like paper):

```css
.page::before {
  content: ""; position: fixed; inset: 0; pointer-events: none;
  mix-blend-mode: multiply; opacity: .2; z-index: 10;
  background-size: 180px 180px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.92' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.12'/%3E%3C/svg%3E");
}
```

Each section also gets a soft white "lamp" wash: `radial-gradient(circle at 50% 32%, #ffffffad, transparent 30rem)`.

**Active-nav squiggle** (an SVG data URI on `a::after`, `viewBox 0 0 120 9`, `preserveAspectRatio=none`):
- thick path `M2 5.5 C14 2.3 24 7.1 37 4.3 S61 3.1 72 5.2 S96 6.6 118 3.4`, stroke `#e69a76`, 2.3px
- thin path `M6 6.6 C25 5.2 45 6.8 62 5.6 S93 4.9 113 5.8`, .75px, opacity .58
- box `height:8px; bottom:-8px; inset-inline:-4px`
- idle: `opacity:0; transform: scaleX(.35) rotate(-1deg); transform-origin: 0`
- active or hover: `opacity:.9; scaleX(1)`, with `transition: opacity .16s, transform .22s cubic-bezier(.2,.8,.2,1)`

**Highlighter word**: `em { position:relative; z-index:0; padding-inline:.08em }`, plus `em::before { background:#ed9a78; border-radius:.15em; inset:53% -.06em 4%; transform:rotate(-1deg); z-index:-1 }`. Only the lower half of the word is highlighted.

**Desk objects**: `position:absolute; filter: drop-shadow(0 18px 18px #382d2229)`. Each object's width is a `clamp()`, it is placed by %, and it carries a fixed `rotate:` value (e.g. macbook `clamp(280px,28vw,470px)`, -8deg; skis 56deg; camera -6deg).
- Entrance spring: `{ stiffness: 44, damping: 18, mass: 1.05 }` from `{ opacity:0, scale:.78, x:±48vw, y:±34vh }`, staggered by `delay × 1.35`. The delays run .04–.46 per object.
- Drag: `dragMomentum:false, dragElastic:.12`, `whileHover scale 1.025`, `whileTap scale .98`.
- Hero copy fades in with `y:22 → 0`, .68s, `ease [.22,1,.36,1]`, delay .38s. The drag hint fades in at 1.05s.

**Project artifact hover**: `translateY(-8px) scale(1.012)`, with the drop-shadow growing to `0 27px 26px #372d2238`, .22s `cubic-bezier(.2,.8,.2,1)`. On mobile (≤760px) the artifacts form a column with 58px gaps and ±2–4deg tilt.

**Sticky note**:
- `aspect-ratio:1; width:300px; background: linear-gradient(118deg,#ffffff24,#0000 32%), #f3d68e; rotate:-1.6deg; box-shadow: 1px 14px 24px #4538262e`
- curled fold: `::after { background: linear-gradient(135deg,#0000 48%,#775d331a 49%) }`
- hover: `translateY(-7px) rotate(1deg)`

**Letter paper**:
- `#f2eddf` with a 28px grid of `#7c6f581a` lines
- `border-radius: 20px 18px 24px 20px; rotate:-.7deg`
- `box-shadow: 0 34px 54px #4337271f, inset 0 0 40px #7d67450d`
- black washi tape strip, `rotate(-14deg)` with a clip-path

**Logo**: an "M" path `M10 34V14l7 10 7-10 7 10 7-10v20`, stroke 3.2 in orange, made of 17 dots.
- The dots assemble over .98s with per-dot delay 0–225ms and scatter ±25px.
- Afterwards they run a 10s idle cycle (scatter → re-gather) plus a 3.8s micro-jitter.
- On hover the glyph shows solid.

**Page transition**: an opacity fade, .44s `[.22,1,.36,1]`, keyed by pathname. The header sits outside the fade. Work thumbnails morph into project pages with the View Transitions API (.62s).

**Study figures** (for the AI reports):
- figure: `width:min(48rem,100vw - 48px); margin:48px 0`, then a Manrope 18px/600 h2 and a 13px description
- bar row: label 12px + value 15px tabular, then a 32px SVG bar (`rect h=18 rx=2`) with a CI whisker, then a 10px detail line ("405/500 correct · 95% interval …")
- metric tabs: `border-bottom: 2px solid`, `aria-pressed` turns teal
- `<details>` "View the data": an 11px table with a scroll limit of 360px
- provenance footnote: a dashed top rule, 11px

### 4.4 Motion rules

- Easing house style: **`cubic-bezier(.22,1,.36,1)`** (expo-out) for entrances and **`cubic-bezier(.2,.8,.2,1)`** for hovers. Hover durations are .15–.22s.
- Looping animation is limited to three things: the logo idle cycle, the photo orbit, and the monitor glare.
- Reduced motion: hover and entrance animations are removed, the video is paused, and the orbit is paused. ⚠️ His hero objects stay at `opacity:0` (a bug), so ours must render the resting state.

---

## 5. The blend for Harith (proposal, not yet built)

**Formula:** Mohtasham's paper, type and object-desk **plus one pixel Harith** who walks through the site.

| Layer | From | Harith version |
| --- | --- | --- |
| Background, palette, type | Mohtasham | Same structure. ✅ **Palette locked 7 Oct 2026: "Chalk & Iron"** with custom plate-blue accents (light `#5784ff`, dark `#7a9cff`). See `docs/design/tokens.css` |
| Hero | Mohtasham's desk objects | Desk objects = **Harith's hobbies** (camera, barbell plate or lifting belt, …). ✅ **Style locked: photo cut-outs** (transparent PNGs with drop-shadows) |
| Personality | Rashad's sprite | **Pixel Harith**, one pose per page: waving (About), coding (Work), writing in a diary (Blog), holding a camera (Gallery), lifting (hobbies) |
| About | Mohtasham's About | Same anatomy: hero object, pull quote with circled word, timeline path, photo ring → Harith's own story |
| Work | Mohtasham's Work | Featured artifact (DagangNow), small artifacts, archive rows |
| Blog = Diary | Mohtasham's Blog | A reverse-chronological **diary** feed |
| Reports | Mohtasham's study post | A separate **`reports`** collection (AI-generated reports in the study format) that diary entries **reference and discuss** |
| Gallery | (none) | Photo stories / collections, the only image-heavy page |

### Proposed content model for Blog + AI reports

```
content/
  diary/        ← your posts (human-written)
    2026-10-07-why-i-rebuilt-my-site/index.mdx
      frontmatter: { title, date, mood?, location?, reports: ["dagangnow-checkout-latency"] }
  reports/      ← AI-generated reports, published as-is
    dagangnow-checkout-latency/index.mdx
      frontmatter: { title, date, model, prompt?, status: "draft" | "final",
                     summary, sources[], data?: "./data.json" }
```

- A diary entry **embeds** a report with `<Report slug="…" />`. This renders as a small paper "clipping" (title, model, date, 2-line summary) that links through.
- Each report page shows **"Referenced in"**, a backlink list of the diary entries that discuss it.
- Report pages use the study format (§1.6): figures, `View the data`, callouts. They also carry a clear **"AI-generated · model · date"** stamp in mono, so readers can always tell the report from your own writing.
