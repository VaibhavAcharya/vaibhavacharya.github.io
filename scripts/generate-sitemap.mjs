import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const site = "https://vaibhavacharya.github.io";
const outDir = path.resolve("docs");
const contentDir = path.resolve("src/content/writings");
const sitemapPath = path.join(outDir, "sitemap.xml");
const ignoredDirectories = new Set(["astro", "og"]);
const ignoredFiles = new Set(["404.html"]);

const routeDefaults = {
    home: { changefreq: "weekly", priority: "1.0" },
    writings: { changefreq: "weekly", priority: "0.8" },
    post: { changefreq: "weekly", priority: "0.6" },
    page: { changefreq: "weekly", priority: "0.5" },
};

function escapeXml(value) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&apos;");
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function parseFrontmatter(markdown) {
    const match = markdown.match(/^---\n([\s\S]*?)\n---/);
    if (!match) return {};

    return Object.fromEntries(
        match[1]
            .split("\n")
            .map((line) =>
                line.match(/^([A-Za-z][A-Za-z0-9_-]*):\s*["']?(.+?)["']?\s*$/),
            )
            .filter(Boolean)
            .map(([, key, value]) => [key, value]),
    );
}

function parseDate(value) {
    if (!value) return null;

    const date = new Date(value);
    return Number.isNaN(date.valueOf()) ? null : date;
}

async function loadWritingMetadata() {
    const entries = await readdir(contentDir, { withFileTypes: true });
    const posts = new Map();

    for (const entry of entries) {
        if (!entry.isFile() || !/\.mdx?$/.test(entry.name)) continue;

        const slug = entry.name.replace(/\.mdx?$/, "");
        const source = await readFile(
            path.join(contentDir, entry.name),
            "utf8",
        );
        const frontmatter = parseFrontmatter(source);
        const lastmod =
            parseDate(frontmatter.updatedDate) ??
            parseDate(frontmatter.pubDate);

        if (lastmod) posts.set(slug, { lastmod: formatDate(lastmod) });
    }

    return posts;
}

function toRoute(filePath) {
    const relativePath = path
        .relative(outDir, filePath)
        .split(path.sep)
        .join("/");

    if (relativePath === "index.html") return "/";
    if (relativePath.endsWith("/index.html")) {
        return `/${relativePath.slice(0, -"index.html".length)}`;
    }

    return `/${relativePath.replace(/\.html$/, "")}`;
}

function toUrl(route) {
    return new URL(route, site).href;
}

async function findHtmlFiles(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    const files = [];

    for (const entry of entries) {
        const entryPath = path.join(directory, entry.name);

        if (entry.isDirectory()) {
            if (!ignoredDirectories.has(entry.name)) {
                files.push(...(await findHtmlFiles(entryPath)));
            }
            continue;
        }

        if (
            entry.isFile() &&
            entry.name.endsWith(".html") &&
            !ignoredFiles.has(entry.name)
        ) {
            files.push(entryPath);
        }
    }

    return files;
}

function latestDate(dates) {
    return dates.filter(Boolean).sort().at(-1);
}

function metadataForRoute(route, writings) {
    const latestWritingDate = latestDate(
        [...writings.values()].map((post) => post.lastmod),
    );

    if (route === "/") {
        return { ...routeDefaults.home, lastmod: latestWritingDate };
    }

    if (route === "/writings/") {
        return { ...routeDefaults.writings, lastmod: latestWritingDate };
    }

    const postMatch = route.match(/^\/writings\/([^/]+)\/$/);
    if (postMatch) {
        return {
            ...routeDefaults.post,
            lastmod: writings.get(postMatch[1])?.lastmod,
        };
    }

    return routeDefaults.page;
}

function createSitemapEntry(route, metadata) {
    const lines = [
        "    <url>",
        `        <loc>${escapeXml(toUrl(route))}</loc>`,
    ];

    if (metadata.lastmod)
        lines.push(`        <lastmod>${metadata.lastmod}</lastmod>`);
    lines.push(`        <changefreq>${metadata.changefreq}</changefreq>`);
    lines.push(`        <priority>${metadata.priority}</priority>`);
    lines.push("    </url>");

    return lines.join("\n");
}

const [htmlFiles, writings] = await Promise.all([
    findHtmlFiles(outDir),
    loadWritingMetadata(),
]);
const entries = htmlFiles
    .map(toRoute)
    .sort((a, b) => toUrl(a).localeCompare(toUrl(b)))
    .map((route) =>
        createSitemapEntry(route, metadataForRoute(route, writings)),
    );

const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    "</urlset>",
    "",
].join("\n");

await writeFile(sitemapPath, sitemap);
console.log(
    `Generated ${path.relative(process.cwd(), sitemapPath)} with ${entries.length} URLs`,
);
