// Pulls the GitHub contribution calendar into src/data/github-activity.json so the
// home page can render it statically. Needs an authenticated `gh` CLI.
//
// Failures are never fatal: the committed JSON stays in place and the build carries
// on, so a machine without `gh` can still build the site.

import { execFile } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);
const login = "VaibhavAcharya";
const outPath = path.resolve("src/data/github-activity.json");

const query = `
{
  user(login: "${login}") {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
          }
        }
      }
    }
  }
}`;

function label(reason) {
    console.warn(`[github-activity] ${reason}. Keeping the committed snapshot.`);
}

async function existingSnapshot() {
    try {
        return JSON.parse(await readFile(outPath, "utf8"));
    } catch {
        return null;
    }
}

const previous = await existingSnapshot();

let calendar;
try {
    const { stdout } = await run("gh", ["api", "graphql", "-f", `query=${query}`], {
        maxBuffer: 8 * 1024 * 1024,
    });
    calendar = JSON.parse(stdout).data?.user?.contributionsCollection
        ?.contributionCalendar;
} catch (error) {
    label(`gh api failed (${error.code ?? error.message})`);
}

if (!calendar?.weeks?.length) {
    if (!calendar) process.exit(0);
    label("the response had no weeks in it");
    process.exit(0);
}

const weeks = calendar.weeks.map((week) =>
    week.contributionDays.map((day) => ({
        date: day.date,
        count: day.contributionCount,
    })),
);

const days = weeks.flat();
const snapshot = {
    totalContributions: calendar.totalContributions,
    start: days.at(0).date,
    end: days.at(-1).date,
    weeks,
};

const unchanged =
    previous &&
    previous.end === snapshot.end &&
    previous.totalContributions === snapshot.totalContributions;

if (unchanged) {
    console.log("[github-activity] Snapshot already current.");
    process.exit(0);
}

await writeFile(outPath, `${JSON.stringify(snapshot, null, 2)}\n`);
console.log(
    `[github-activity] ${snapshot.totalContributions} contributions, ${snapshot.start} to ${snapshot.end}.`,
);
