# Project Overview

This website serves as both a **portfolio** and **blog** for Vaibhav Acharya.

## Tech Stack

- **Framework**: Astro 5.x
- **Styling**: TailwindCSS 4.x
- **Content**: MDX for blog posts
- **Package Manager**: Bun

## Development

```bash
bun install     # Install dependencies
bun run dev     # Start dev server
bun run build   # Build for production
```

## Deployment

This site is deployed to **GitHub Pages**. The build output is configured to go to the `./docs` directory.

**Important**: Always run `bun run build` before committing to ensure the build files in `./docs` are up to date.

### Custom Domain

The site is served from `vaibhavacharya.com`. `vaibhavacharya.github.io/*` 301-redirects to `vaibhavacharya.com/*` automatically, handled by GitHub once the custom domain is set in repo Settings, Pages.

- `public/CNAME` holds `vaibhavacharya.com` and is copied to `docs/CNAME` on every build. Do not commit a CNAME directly in `docs/`, builds would overwrite it.
- `site` in `astro.config.mjs` and `scripts/generate-sitemap.mjs` must stay in sync with the canonical domain. Everything else (canonical link, OG/Twitter URLs, sitemap, RSS, robots.txt) derives from `Astro.site`.
- DNS lives at the registrar: apex A records point to GitHub Pages IPs (`185.199.108–111.153`). Not managed in this repo.

## Project Structure

```
src/
  components/   # Reusable Astro components
  content/      # Blog posts (MDX)
  layouts/      # Page layouts
  pages/        # Route-based pages
  styles/       # Global CSS
docs/           # Build output (deployed to GitHub Pages)
```

## Configuration

- Site URL: https://vaibhavacharya.com
- Astro config: `astro.config.mjs`
- Site constants: `src/consts.ts`
