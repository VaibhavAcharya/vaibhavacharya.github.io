// Pulls the numbers the shipping ledger cites into src/data/stats.json: GitHub
// stars, npm downloads, ProductHunt upvotes. The ledger reads the snapshot at
// build time, so nothing is fetched in the browser.
//
// Failures are never fatal, and they are never partial either: a source that
// does not answer keeps whatever the committed snapshot already had for it, so
// a machine without `gh` or without a network still builds the site.
//
// Runs under Bun, which is what lets it read the ledger straight out of the
// TypeScript it already lives in.

import { execFile } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

import { EXPERIENCE, PROJECTS } from "../src/data/resume.ts";

const run = promisify(execFile);
const outPath = path.resolve("src/data/stats.json");

// Straight off the ledger, hidden entries included: naming a repo on an entry is
// all it should take to have its count fetched.
const entries = [...PROJECTS, ...EXPERIENCE];
const named = (key) => [...new Set(entries.map((entry) => entry[key]).filter(Boolean))];

const REPOS = named("repo");
const PACKAGES = named("npm");
const PH_SLUGS = named("ph");

// npm's range endpoint caps at 18 months per call, so all-time is walked in
// windows back to the first release. 2022 predates every package here.
const NPM_EPOCH = "2022-01-01";

function warn(source, reason) {
    console.warn(`[stats] ${source}: ${reason}. Keeping the committed values.`);
}

async function existingSnapshot() {
    try {
        return JSON.parse(await readFile(outPath, "utf8"));
    } catch {
        return {};
    }
}

async function stars() {
    const query = `{
        ${REPOS.map((nameWithOwner, index) => {
            const [owner, name] = nameWithOwner.split("/");
            return `r${index}: repository(owner: "${owner}", name: "${name}") {
            nameWithOwner
            stargazerCount
        }`;
        }).join("\n")}
    }`;

    const { stdout } = await run("gh", ["api", "graphql", "-f", `query=${query}`], {
        maxBuffer: 4 * 1024 * 1024,
    });

    const repos = Object.values(JSON.parse(stdout).data ?? {});
    if (!repos.length) throw new Error("no repositories came back");

    return Object.fromEntries(
        repos
            .filter(Boolean)
            .map((repo) => [repo.nameWithOwner, { stars: repo.stargazerCount }]),
    );
}

function windows(from, to) {
    const spans = [];
    let start = new Date(`${from}T00:00:00Z`);

    while (start <= to) {
        const end = new Date(start);
        end.setUTCMonth(end.getUTCMonth() + 12);
        if (end > to) end.setTime(to.getTime());
        spans.push([start.toISOString().slice(0, 10), end.toISOString().slice(0, 10)]);
        start = new Date(end);
        start.setUTCDate(start.getUTCDate() + 1);
    }

    return spans;
}

async function downloads(name, today) {
    const days = new Map();

    for (const [from, to] of windows(NPM_EPOCH, today)) {
        const response = await fetch(
            `https://api.npmjs.org/downloads/range/${from}:${to}/${name}`,
        );
        if (!response.ok) throw new Error(`downloads range said ${response.status}`);

        for (const day of (await response.json()).downloads ?? []) {
            days.set(day.day, day.downloads);
        }
    }

    if (!days.size) throw new Error("no download days came back");

    const total = [...days.values()].reduce((sum, count) => sum + count, 0);
    return { total };
}

// The official badge is an SVG with the count set in it, and it is the only
// public read of a launch's upvotes that does not need an API token.
async function upvotes(slug) {
    const response = await fetch(
        `https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=${slug}&theme=neutral`,
    );
    if (!response.ok) throw new Error(`badge said ${response.status}`);

    const count = (await response.text()).match(/y="27">(\d+)<\/tspan>/)?.[1];
    if (!count) throw new Error("the badge had no count in it");

    return { upvotes: Number(count) };
}

async function collect(label, keys, one) {
    const settled = await Promise.all(
        keys.map(async (key) => {
            try {
                return [key, await one(key)];
            } catch (error) {
                warn(`${label} ${key}`, error.message ?? error.code);
                return null;
            }
        }),
    );

    return Object.fromEntries(settled.filter(Boolean));
}

const previous = await existingSnapshot();
const today = new Date();

let repos = {};
try {
    repos = await stars();
} catch (error) {
    warn("github", `gh api failed (${error.code ?? error.message})`);
}

const [npm, ph] = await Promise.all([
    collect("npm", PACKAGES, (name) => downloads(name, today)),
    collect("producthunt", PH_SLUGS, upvotes),
]);

const snapshot = {
    fetched: today.toISOString().slice(0, 10),
    repos: { ...previous.repos, ...repos },
    npm: { ...previous.npm, ...npm },
    ph: { ...previous.ph, ...ph },
};

await writeFile(outPath, `${JSON.stringify(snapshot, null, 2)}\n`);
console.log(
    `[stats] ${Object.keys(snapshot.repos).length} repos, ${Object.keys(snapshot.npm).length} packages, ${Object.keys(snapshot.ph).length} launches.`,
);
