// src/data/stats.ts
// Reads the build-time snapshot in stats.json and turns it into the line of
// numbers under a ledger row. An entry names its repo, its package and its
// launch; every count comes from the last build. See scripts/fetch-stats.mjs.

import type { Entry } from "./resume";
import snapshot from "./stats.json";

interface Snapshot {
    fetched: string;
    repos: Record<string, { stars: number }>;
    npm: Record<string, { total: number }>;
    ph: Record<string, { upvotes: number }>;
}

const stats = snapshot as Snapshot;

/** Below these, a count says less than the space it takes. */
const STARS_SHOWN_FROM = 5;
const UPVOTES_SHOWN_FROM = 25;

const compact = (value: number) =>
    value < 10_000 ? String(value) : `${(value / 1000).toFixed(1)}k`;

const stars = (entry: Entry) =>
    (entry.repo ? stats.repos[entry.repo]?.stars : 0) ?? 0;

const downloads = (entry: Entry) =>
    (entry.npm ? stats.npm[entry.npm]?.total : 0) ?? 0;

const upvotes = (entry: Entry) => (entry.ph ? stats.ph[entry.ph]?.upvotes : 0) ?? 0;

export function detail(entry: Entry): string | undefined {
    const starCount = stars(entry);
    const downloadCount = downloads(entry);
    const upvoteCount = upvotes(entry);

    const parts = [
        starCount >= STARS_SHOWN_FROM ? `${compact(starCount)} GitHub stars` : "",
        downloadCount ? `${compact(downloadCount)} npm downloads` : "",
        entry.detail,
        upvoteCount >= UPVOTES_SHOWN_FROM
            ? `${compact(upvoteCount)} ProductHunt upvotes`
            : "",
        entry.phRank ? `#${entry.phRank} of the day` : "",
    ].filter(Boolean);

    return parts.length ? parts.join(" · ") : undefined;
}

export function marginStars(entry: Entry): number | undefined {
    const count = stars(entry);
    return count >= STARS_SHOWN_FROM ? count : undefined;
}

/** The one place that knows what counts, so a new kind cannot be left out. */
export const hasMarks = (entry: Entry) =>
    Boolean(entry.ph || marginStars(entry) || entry.tweet || entry.link);
