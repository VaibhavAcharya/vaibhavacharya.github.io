// src/pages/og/[...slug].png.ts
// Prerendered OG PNGs. One per route: index + each blog post.

import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { renderOg } from "../../lib/og";

export const prerender = true;

const LITERATA_ITALIC_PATH = join(
    process.cwd(),
    "node_modules/@fontsource/literata/files/literata-latin-400-italic.woff",
);
const CASCADIA_PATH = join(
    process.cwd(),
    "node_modules/@fontsource/cascadia-code/files/cascadia-code-latin-400-normal.woff",
);

const literataItalic = readFileSync(LITERATA_ITALIC_PATH);
const cascadia = readFileSync(CASCADIA_PATH);

function formatPubDate(d: Date): string {
    return d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

export async function getStaticPaths() {
    const posts = await getCollection("blog");

    return [
        {
            params: { slug: "index" },
            props: {
                title: "Vaibhav Acharya, engineer.",
                meta: "vaibhavacharya.github.io",
            },
        },
        ...posts.map((post) => ({
            params: { slug: post.id },
            props: {
                title: post.data.title + ".",
                meta: `${formatPubDate(post.data.pubDate)}  ·  vaibhavacharya.github.io`,
            },
        })),
    ];
}

export const GET: APIRoute = async ({ props }) => {
    const { title, meta } = props as { title: string; meta: string };

    const svg = await satori(renderOg({ title, meta }) as any, {
        width: 1200,
        height: 630,
        fonts: [
            {
                name: "Literata",
                data: literataItalic,
                weight: 400,
                style: "italic",
            },
            {
                name: "Cascadia Code",
                data: cascadia,
                weight: 400,
                style: "normal",
            },
        ],
    });

    const png = new Resvg(svg).render().asPng();

    return new Response(png, {
        headers: { "Content-Type": "image/png" },
    });
};
