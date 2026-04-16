// src/lib/buildDate.ts
// Captured at module-load time, which in Astro is build time for SSG.

export const BUILD_DATE: Date = new Date();

export function formatBuildDate(d: Date = BUILD_DATE): string {
    // e.g. "17 April 2026"
    return d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}
