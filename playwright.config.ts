import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "tests",
    fullyParallel: true,
    reporter: [["list"], ["stateofpixel/playwright"]],
    use: {
        baseURL: "http://localhost:4399",
        reducedMotion: "reduce",
    },
    projects: [
        {
            name: "desktop",
            use: {
                ...devices["Desktop Chrome"],
                viewport: { width: 1280, height: 800 },
            },
        },
        {
            name: "mobile",
            use: {
                ...devices["Desktop Chrome"],
                viewport: { width: 390, height: 844 },
            },
        },
    ],
    webServer: {
        command:
            "pnpm astro build --outDir dist && pnpm astro preview --outDir dist --port 4399",
        url: "http://localhost:4399",
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
    },
});
