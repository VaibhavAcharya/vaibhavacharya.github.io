// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
    site: "https://vaibhavacharya.github.io",

    output: "static",
    outDir: "./docs",
    build: {
        assets: "astro",
    },

    integrations: [
        mdx(),
        sitemap({
            lastmod: new Date(),
        }),
        react(),
    ],

    vite: {
        plugins: [tailwindcss()],
    },
});
