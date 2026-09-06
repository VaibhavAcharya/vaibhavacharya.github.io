// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";

import tailwindcss from "@tailwindcss/vite";

function rehypeOpenExternalLinksInNewTab() {
    /** @param {unknown} href */
    const isExternal = (href) => typeof href === "string" && /^https?:\/\//i.test(href);

    /** @param {import("hast").Root} tree */
    return (tree) => {
        /** @param {import("hast").Nodes} node */
        const walk = (node) => {
            if (node.type === "element" && node.tagName === "a" && isExternal(node.properties.href)) {
                node.properties.target = "_blank";
                node.properties.rel = "noopener noreferrer";
            }
            if ("children" in node) node.children.forEach(walk);
        };
        walk(tree);
    };
}

// https://astro.build/config
export default defineConfig({
    site: "https://vaibhavacharya.com",

    output: "static",

    // The writings index now lives on the home page.
    redirects: {
        "/writings": "/#writings",
    },
    outDir: "./docs",
    build: {
        assets: "astro",
    },

    markdown: {
        smartypants: false,
        rehypePlugins: [rehypeOpenExternalLinksInNewTab],
    },

    integrations: [mdx(), react()],

    vite: {
        plugins: [tailwindcss()],
    },
});
