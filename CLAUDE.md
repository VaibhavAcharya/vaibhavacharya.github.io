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

- Site URL: https://vaibhavacharya.github.io
- Astro config: `astro.config.mjs`
- Site constants: `src/consts.ts`
