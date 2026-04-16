---
title: Portfolio redesign, from themed blog to quiet principal-engineer site
date: 2026-04-17
status: drafted, pending review
author: Vaibhav Acharya (via brainstorm)
---

# Portfolio redesign

## 1. Summary

Replace the current themed portfolio and blog (gradient + grid + noise overlays, Handjet display font, chip-style social buttons, emoji footer) with a quiet, senior, principal-engineer register. The new site is a one-screen identity document with three named sections (now, previously, elsewhere) and a colophon footer. The `/blog` index and `/blog/[slug]` pages inherit the same register and drop hero images.

The blog is de-emphasised per the writer's stated preference. It gets one row in `elsewhere`; there is no list of posts on the home page and no dedicated "writing" section.

## 2. Who and why

- **Audience**: peers, prospective collaborators, and recruiters reviewing Vaibhav Acharya (Software Engineer at Netlify).
- **State of mind**: they arrive in under five seconds of attention, from a link, with low patience for theme chrome.
- **Goal**: tell them who he is, what he is doing now, where he has worked, and how to reach him. In that order.
- **Emotional target**: thoughtful, senior, earned. Not decorated, not fashionable, not "designed by an LLM in 2025".

## 3. Aesthetic direction

- **Register**: refined editorial minimalism. Manuscript adjacent but not costumed. No Roman numerals, no § glyphs, no performed metadata.
- **Core move**: hierarchy is done by type and space alone. No drop shadows, no rounded cards, no gradients, no glassmorphism, no background textures, no overlays, no grid patterns, no noise.
- **One accent only**: a terracotta umber (`oklch(0.52 0.11 50)`) held under 10% of visual weight. Used on section labels, link underlines, one italicised word in the Now paragraph, and nothing else.

## 4. Typography

All three families chosen outside impeccable's reflex-reject list.

| Role | Family | Use |
| --- | --- | --- |
| Display | **Literata** (variable, italic) | Hero name; section labels; italicised "Netlify" in the Now paragraph; blog post titles |
| Body | **Atkinson Hyperlegible** | Now paragraph; company names in Previously; value column in Elsewhere; blog post body |
| Mono | **Cascadia Code**, ligatures disabled | Role labels in Previously; label column in Elsewhere; all rows of the footer colophon; blog post meta line |

**Rationale**. Literata was commissioned by Google for Google Books reading and has a real `opsz` axis, so display weights look different from reading italic. Atkinson Hyperlegible was engineered at the Braille Institute for low-vision reading, so letterforms are unusually distinct; the whole page reads as "careful". Cascadia Code is Microsoft's terminal font; ligatures are turned off via `font-variant-ligatures: none` to keep labels crisp.

### 4.1 Type scale

Modular, with generous contrast between steps. Hero fluid via `clamp()`; body sizes fixed `rem` (app-UI pattern, not marketing fluid).

| Element | Size | Family | Details |
| --- | --- | --- | --- |
| Hero name | `clamp(42px, 5.6vw, 60px)` | Literata italic 400 | `opsz 72`, line-height 1.02, tracking -0.02em |
| Hero lede | 20px | Literata italic 400 | `opsz 24`, line-height 1.42, max 42ch |
| Section label | 17px | Literata italic 400 | `opsz 24`, accent colour |
| Now / body | 15px | Atkinson 400 | line-height 1.7, max 62ch |
| Body emphasis | 15px | Literata italic 400 (inline) | inline `<em>` style in Now paragraph |
| Table value | 15px | Atkinson 400 | same size as body |
| Mono label | 11.5px | Cascadia 400 | tracking 0.02em, ligatures off |
| Footer row | 11px | Cascadia 400 | line-height 1.7, tracking 0.02em |
| Blog post title | `clamp(32px, 4vw, 44px)` | Literata italic 400 | `opsz 48`, line-height 1.1 |
| Blog post body | 17px | Atkinson 400 | line-height 1.75, max 62ch |

## 5. Colour and paper

All values in OKLCH for perceptual uniformity. Neutrals tinted toward the amber hue for cohesion with the accent.

| Token | Value | Use |
| --- | --- | --- |
| `--paper` | `oklch(0.975 0.006 80)` | page background |
| `--ink` | `oklch(0.22 0.008 80)` | primary text, hero |
| `--ink-muted` | `oklch(0.28 0.008 80)` | body copy |
| `--ink-soft` | `oklch(0.50 0.01 80)` | mono labels, muted |
| `--rule-dotted` | `oklch(0.74 0.01 80)` | table row dividers (dotted) |
| `--rule-solid` | `oklch(0.78 0.01 80)` | footer separator (solid) |
| `--accent` | `oklch(0.52 0.11 50)` | section labels, accent marks |
| `--accent-45` | `oklch(0.52 0.11 50 / 45%)` | link underlines |

No pure black, no pure white. No gray on paper. Everything tinted.

## 6. Layout

### 6.1 Home (`/`)

Single centred column. `max-width: 580px`. Symmetric horizontal padding of 40px. No left margin rail, no section glyphs in the margin.

```
Vaibhav Acharya,
engineer.                                                         [hero]

I work at the seam where product, design
and engineering stop being separate jobs.                         [lede]


now                                                               [label]

Software Engineer at Netlify. I like going 0 to 1, shipping
often, and operating independently. Most of what I care about
lives where the web, AI and tools for builders overlap. Off hours,
still building small products to find out whether they deserve to
exist.


previously                                                        [label]

product engineer       Supernova AI
web engineer           Skcript
founder                InvocationX
junior engineer        Dukaan


elsewhere                                                         [label]

email         vaibhavacharya111@gmail.com
github        github.com/VaibhavAcharya
x             @VaibhavAcharya_
bluesky       vaibhavacharya.bsky.social
linkedin      in/vaibhav-acharya
writing       /blog


─────────────────────────────────────────────
source         github.com/VaibhavAcharya/vaibhavacharya.github.io
built with     Astro, Tailwind, GitHub Pages
last updated   17 April 2026
based          IN
```

**Mechanics**

- Section labels sit at `margin-top: 52px; margin-bottom: 14px`. Italic Literata 17px, accent colour.
- Tables use `border-bottom: 1px dotted var(--rule-dotted)` on each `td` for ruled rows.
- In the Previously table, the role column (mono) takes 38% width; the company column (sans) takes the rest. Company names are linkable; underline is 1px solid `var(--accent-45)`.
- In the Elsewhere table, the label column (mono) takes 30% width; value column (sans) takes the rest. Each value is linkable.
- Footer separated by `border-top: 1px solid var(--rule-solid)`, 18px padding-top. Rows are flex-justified (label left, value right), Cascadia 11px across both columns.

### 6.2 Blog index (`/blog`)

Same column width. Masthead is a small back link, then the content.

```
← vaibhav acharya                                                 [back link, mono 11.5px]

writing                                                           [label]

I write rarely. This is the complete archive.                     [body]

may 7, 2025      JavaScript Closures and Scope
may 6, 2025      Deep Dive into JavaScript Sorting
may 4, 2025      Functional Programming in JavaScript
may 4, 2025      Deep Dive into JavaScript Array Methods


─────────────────────────────────────────────
[same colophon as home]
```

No hero images, no cards, no grid. A ruled dated list. Dates pull from each post's `pubDate` frontmatter. Clicking a title routes to `/blog/<slug>`. An RSS link is not shown in the body; it remains discoverable via `<link rel="alternate" type="application/rss+xml">` in the head.

### 6.3 Blog post (`/blog/[slug]`)

Same column width, same register.

```
← vaibhav acharya / writing                                       [back link, mono 11.5px]


JavaScript Closures and Scope                                     [title, Literata italic]
by Vaibhav Acharya, 7 May 2025                                    [meta, mono 11.5px]

─────────────────────────────────────────────

[post body, Atkinson 17px, line-height 1.75, max-width 62ch]

[inline elements:
  inline code   - Cascadia Code 0.92em, background oklch(0.93 0.008 80), padding 2px 5px
  code blocks   - Cascadia Code, same background as inline code (oklch(0.93 0.008 80)), padding 16px 20px, border-radius 4px, no syntax highlight
  blockquotes   - Literata italic 20px, no quote marks, simple left indent
  h2/h3         - Literata italic, smaller than post title; no rules above
  links         - same accent-45 underline as home]


─────────────────────────────────────────────
[same colophon as home]
```

**Hero images are removed**. The prose runs straight from title to body. The current `heroImage` frontmatter is retained in the collection schema but is no longer rendered on the post page. It continues to be used as the OG image via `<meta property="og:image">`, so social previews still have a picture.

## 7. Copy

### 7.1 Home copy (exact)

- **Name** (two lines): `Vaibhav Acharya,` / `engineer.`
- **Lede**: `I work at the seam where product, design and engineering stop being separate jobs.`
- **Now**: `Software Engineer at [Netlify]. I like going 0 to 1, shipping often, and operating independently. Most of what I care about lives where the web, AI and tools for builders overlap. Off hours, still building small products to find out whether they deserve to exist.` The brackets mark the one word rendered in `Literata italic` + accent colour (no underline, just emphasis).
- **Previously rows** (role, company):
  - `product engineer`, `Supernova AI`
  - `web engineer`, `Skcript`
  - `founder`, `InvocationX`
  - `junior engineer`, `Dukaan`
- **Elsewhere rows** (label, value, href):
  - `email`, `vaibhavacharya111@gmail.com`, `mailto:vaibhavacharya111@gmail.com`
  - `github`, `github.com/VaibhavAcharya`, `https://github.com/VaibhavAcharya`
  - `x`, `@VaibhavAcharya_`, `https://x.com/VaibhavAcharya_`
  - `bluesky`, `vaibhavacharya.bsky.social`, `https://bsky.app/profile/vaibhavacharya.bsky.social`
  - `linkedin`, `in/vaibhav-acharya`, `https://www.linkedin.com/in/vaibhav-acharya`
  - `writing`, `/blog`, `/blog`
- **Colophon rows** (label, value):
  - `source`, `github.com/VaibhavAcharya/vaibhavacharya.github.io` (linked)
  - `built with`, `Astro, Tailwind, GitHub Pages`
  - `last updated`, dynamic from build time (format `DD Month YYYY`, e.g. `17 April 2026`)
  - `based`, `IN`

### 7.2 Blog index copy

- Label: `writing`
- Intro line (one sentence, body style): `I write rarely. This is the complete archive.`

### 7.3 Back-link copy

- On `/blog`: `← vaibhav acharya`
- On `/blog/<slug>`: `← vaibhav acharya / writing`

Each back-link is mono 11.5px, `var(--ink-soft)`. Underline on hover only.

### 7.4 Meta (src/consts.ts)

```ts
export const SITE_TITLE = "Vaibhav Acharya, engineer.";
export const SITE_DESCRIPTION = "Software Engineer at Netlify. I work at the seam where product, design and engineering stop being separate jobs.";
```

No em dashes anywhere. No emoji. No "corner of the internet".

## 8. Motion

Minimal. One page-load stagger only.

- First paint: opacity fade 0 → 1 over 320ms, `cubic-bezier(0.2, 0.8, 0.2, 1)` (ease-out-quart). Hero name at 0ms, lede at 60ms, sections at 120ms, footer at 180ms.
- No transforms, no scroll-triggered reveals, no hover animations (except link underline colour transitioning over 120ms on hover).
- `@media (prefers-reduced-motion: reduce)`: skip the fade; render immediately.
- No cursor parallax, no backgrounds in motion, no scroll effects.

## 9. Responsive

- Column max-width 580px; natural fluidity below that via 40px symmetric padding.
- **Mobile (< 480px)**: padding reduces to 24px. Tables keep two columns but the mono column widens to 44% / 40% respectively (mono text is narrower by default) and values shrink to 14px. No stacking; the two-column rhythm is part of the design.
- **Large screens**: no max-width increase. The page does not expand. This is an intentional "the page stops where the reading stops" choice.
- Hero name wraps at its natural break; the explicit `<br />` between "Vaibhav Acharya," and "engineer." is a design decision and is retained at all breakpoints.

## 10. Files (scope of change)

### 10.1 New files

| Path | Purpose |
| --- | --- |
| `src/components/Colophon.astro` | Footer block (4 rows: source, built with, last updated, based) |
| `src/components/BackLink.astro` | Back-link header for `/blog` and `/blog/[slug]` |
| `src/lib/buildDate.ts` | Exposes last-updated date as a static string populated at build time |
| `specs/2026-04-17-redesign-design.md` | This document |

### 10.2 Rewrites

| Path | Change |
| --- | --- |
| `src/styles/global.css` | Replace Handjet / Work Sans theme with Literata + Atkinson + Cascadia; add OKLCH custom properties; remove old font-variable declarations |
| `src/pages/index.astro` | Rewrite to hero + now + previously + elsewhere + colophon, no backgrounds, no chips |
| `src/pages/blog/index.astro` | Rewrite as dated ruled list, remove hero images and card grid |
| `src/layouts/BlogPostLayout.astro` | Rewrite: remove hero image render, remove RSS chip, remove orange prose classes, replace with Literata/Atkinson prose styles |
| `src/components/BaseHead.astro` | Update Google Fonts URL (Literata, Atkinson Hyperlegible, Cascadia Code); drop Handjet + Work Sans imports; keep canonical / OG / sitemap / Umami tags |
| `src/consts.ts` | New `SITE_TITLE` and `SITE_DESCRIPTION` |

### 10.3 Deletions

| Path | Reason |
| --- | --- |
| `src/components/GradientBackground.astro` | No longer used; the page has no background layers |
| `src/components/NoiseOverlay.astro` | Same |
| `src/components/GridBackground.astro` | Same |
| `src/components/Header.astro` | Replaced by inline `BackLink` where needed; home has no header |
| `src/components/Footer.astro` | Replaced by `Colophon` |
| `public/grid.svg` | Unused after GridBackground deletion |

### 10.4 Unchanged

- `src/pages/rss.xml.js`
- `src/pages/robots.txt.ts`
- `public/favicon.svg`, stays for now. If it clashes visually during implementation, that's a follow-up.
- `public/og.png`, stays. A new OG image in the new register would be nice but is explicitly out of scope here.
- `astro.config.mjs`, `package.json`, no config changes required. No new dependencies.

## 11. Technical notes

- **Font loading**: single `https://fonts.googleapis.com/css2?` URL with all three families and needed weights/axes. Preconnect to `fonts.googleapis.com` and `fonts.gstatic.com` stays. `display=swap`.
- **Cascadia ligatures**: globally disabled on `.font-mono` class via `font-variant-ligatures: none`.
- **Build output**: continues to go to `./docs` for GitHub Pages. Nothing else changes in the deploy pipeline.
- **`last updated`** in the colophon: populated from `buildDate.ts` which evaluates `new Date()` at build time. Formatted as `D Month YYYY`.
- **No Tailwind removal**: Tailwind 4 stays. New styles live in `global.css` using Tailwind's `@theme` directive for CSS variables plus regular CSS rules for the bespoke manuscript register. The few utility classes still in use (`flex`, `gap`, `max-w`) remain valid.

## 12. Open items

These are resolved during implementation, not here.

- Real URLs for `Supernova AI` and `InvocationX`. If the URL is unknown at implementation time, the row renders as plain text (no link). User supplies URLs during the implementation step or as a follow-up.
- Whether to add a subtle initial-letter mark as favicon, in accent colour. Deferred.
- Regenerated OG image. Deferred.

## 13. Out of scope

- A "projects" page listing Interesting Cuts, Email AI, Prompt Playground, oneprompt, Intelcave, SaaSData, Code GPT, Uniboat, etc. The Now paragraph is the only mention. A future `/work` page could be added without altering this spec.
- Search, tags, or categories on `/blog`. The archive is four posts; a list is enough.
- Dark mode. Paper register only.
- Analytics change. The existing Umami script in `BaseHead.astro` stays.
- Any change to RSS, sitemap, or robots.

## 14. Design context captured (for future brainstorms)

Brand words used to select type: **ships often, thinks clearly, doesn't shout**. Register: refined editorial minimalism, paper-warm, single muted accent. Anti-references: AI-monoculture portfolios (purple gradients on dark, Inter everywhere, rounded card grids, chip-style social buttons, shiny hero sections). Any future work on this site should hold to this register unless a conscious decision is made to break it.
