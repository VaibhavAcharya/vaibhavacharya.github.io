// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
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

    integrations: [mdx(), react()],

    vite: {
        plugins: [tailwindcss()],
    },
});
