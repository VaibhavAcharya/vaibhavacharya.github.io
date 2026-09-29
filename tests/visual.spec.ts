import { readdirSync } from "node:fs";
import { test } from "@playwright/test";
import { snapshot } from "stateofpixel/playwright";

const writings = readdirSync("src/content/writings")
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => `/writings/${file.replace(/\.mdx$/, "")}`);

const routes = ["/", ...writings];
const colorSchemes = ["light", "dark"] as const;

for (const route of routes) {
    for (const colorScheme of colorSchemes) {
        test(`${route} ${colorScheme}`, async ({ page }) => {
            await page.emulateMedia({ colorScheme });
            await page.addInitScript(() => {
                let seed = 1;
                Math.random = () => {
                    seed = (seed * 16807) % 2147483647;
                    return seed / 2147483647;
                };
            });
            await page.clock.install({
                time: new Date("2026-01-01T00:00:00Z"),
            });
            await page.goto(route, { waitUntil: "networkidle" });

            const pageHeight = await page.evaluate(
                () => document.body.scrollHeight,
            );
            const viewportHeight = page.viewportSize()?.height ?? 800;
            for (let y = 0; y < pageHeight; y += viewportHeight) {
                await page.evaluate((top) => window.scrollTo(0, top), y);
                await page.clock.runFor(100);
            }
            await page.clock.runFor(5_000);
            await page.evaluate(() => window.scrollTo(0, 0));
            await page.waitForLoadState("networkidle");

            await page.addStyleTag({
                content:
                    'svg[aria-label*="GitHub contributions"] { visibility: hidden; }',
            });

            await snapshot(
                page,
                `${route === "/" ? "home" : route.slice(1)} ${colorScheme}`,
            );
        });
    }
}
