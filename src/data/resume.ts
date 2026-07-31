// src/data/resume.ts
// Single source of truth for the home page, which doubles as the printable resume.

export interface Entry {
    name: string;
    href?: string;
    /** Right-hand side of the dotted leader row. */
    meta?: string;
    /** Renders `currently` in the accent colour before `meta`. */
    current?: boolean;
    description?: string;
    /** Supporting numbers, set below the description. */
    detail?: string;
    /** Aside about what happened to it. Set below the numbers, in a quieter tone. */
    note?: string;
    /** Which block of the shipping ledger it belongs to. */
    group?: Group;
    /** ProductHunt product slug. Renders a badge linking to the launch. */
    ph?: string;
    /** Where it placed on its launch day. Fixed the moment the day ended. */
    phRank?: number;
    /** Gallery key for anything that never had a launch; see src/data/shots.ts. */
    media?: string;
    /** The post that announced it. */
    tweet?: string;
    /** Somewhere worth sending people that is not the entry's own href. */
    link?: { href: string; label: string };
    /** `owner/name`. Carries the live star count; see src/data/stats.ts. */
    repo?: string;
    /** Package name on npm. Carries the live download count. */
    npm?: string;
    /** Year it started, from the git history or the Vercel project. */
    year?: number;
    /** What the sort toggle orders on, when the year is too coarse to be useful. */
    sortKey?: number;
    /**
     * Kept in the file but off every page. Nothing is ever deleted here: an
     * entry that stops being worth showing gets hidden, not dropped.
     */
    hidden?: boolean;
}

/** Ledger blocks, in the order they appear. */
export const GROUP_ORDER = [
    "products",
    "editor tools",
    "cli",
    "libraries",
    "not launched",
    "smaller",
] as const;

export type Group = (typeof GROUP_ORDER)[number];

export const RESUME_ROLE = "engineer + (product & design)";
export const RESUME_TAGLINE = "whatever gets us close to product-market fit";

export const RESUME_CONTACT = [
    {
        label: "email",
        value: "hello@vaibhavacharya.com",
        href: "mailto:hello@vaibhavacharya.com",
    },
    {
        label: "site",
        value: "vaibhavacharya.com",
        href: "https://vaibhavacharya.com",
    },
    {
        label: "github",
        value: "github.com/VaibhavAcharya",
        href: "https://github.com/VaibhavAcharya",
    },
    {
        label: "linkedin",
        value: "in/vaibhav-acharya",
        href: "https://www.linkedin.com/in/vaibhav-acharya",
    },
];

export const EXPERIENCE: Entry[] = [
    {
        name: "Netlify",
        href: "https://netlify.com",
        meta: "software engineer",
        current: true,
        link: {
            href: "https://www.netlify.com/platform/agent-runners/",
            label: "agent runners",
        },
        description:
            "Building product surfaces across the Netlify platform, from the UI down to the systems behind it. Currently focusing on Agent Runners: Claude Code, Codex and Gemini run against live projects from the browser alone, and every change arrives as a deploy preview to review.",
    },
    {
        name: "Supernova AI",
        href: "https://www.getsupernova.ai",
        meta: "product engineer",
        description:
            "One of four engineers on an AI spoken-English tutor for India. Built the payment and analytics integrations, the A/B experiment system, and the optimized chat UI the lessons run on.",
    },
    {
        name: "Skcript",
        href: "https://skcript.com",
        meta: "web engineer",
        description:
            "Built product after product across the company: helpOS, a centralized email engine, a widget framework, and an OG image generator among them.",
    },
    {
        name: "InvocationX",
        meta: "co-founder",
        media: "invocationx",
        description:
            "Took on projects for a range of clients. Learned a lot about marketing, and about how differently every business needs to be served.",
    },
    {
        name: "Uniboat",
        meta: "co-founder",
        media: "uniboat",
        tweet: "https://x.com/VaibhavAcharya_/status/1550745821049950209",
        description:
            "10-minute grocery delivery. Missed Zepto so much we started our own.",
        detail: "2,000+ visits · 25+ orders · 180+ products",
    },
    {
        name: "Dukaan",
        href: "https://mydukaan.io",
        meta: "junior engineer",
        description:
            "Closer to an internship than a tech role. Learned how things actually work inside a company.",
    },
];

// Ordered by hand, and that order is what the sort toggle calls relevance: what
// should be read first, which is not always what has the biggest numbers.
export const PROJECTS: Entry[] = [
    {
        name: "Ultra AI",
        year: 2024,
        group: "products",
        ph: "ultra-ai",
        phRank: 11,
        description:
            "One gateway for every AI provider, with semantic caching, prompt versioning, model fallbacks and rate limits behind a single API.",
        note: "The domain lapsed and now points at a parked page.",
    },
    {
        name: "Code-GPT",
        year: 2023,
        group: "editor tools",
        ph: "code-gpt-2",
        phRank: 8,
        repo: "VaibhavAcharya/code-gpt",
        tweet: "https://x.com/VaibhavAcharya_/status/1623555668799295488",
        meta: "10,000+ installs",
        description:
            "A VS Code extension that gives you instant explanations for your code using AI.",
        note: "Taken down over a trademark complaint about the name.",
    },
    {
        name: "SaaSData.app",
        year: 2023,
        group: "products",
        href: "https://saasdata.vercel.app",
        ph: "saasdata-app",
        meta: "1,000+ visits",
        description: "Database of 30,000+ SaaS companies & 25,000+ founders.",
        detail: "in 3 days · growing Google index ranking",
    },
    {
        name: "Intelcave.com",
        year: 2024,
        group: "products",
        ph: "intelcave",
        meta: "100+ users",
        description:
            "Chat with your database, create insightful collections and write SQL queries in plain conversational language.",
        detail: "in a week · used internally at the company every day",
    },
    {
        name: "Gist Snip",
        year: 2022,
        group: "editor tools",
        href: "https://marketplace.visualstudio.com/items?itemName=vaibhavacharya.gist-snip",
        ph: "gist-snip",
        phRank: 13,
        repo: "VaibhavAcharya/gist-snip",
        tweet: "https://x.com/VaibhavAcharya_/status/1603068603024056320",
        meta: "250+ installs",
        description:
            "Use your GitHub gists as autocomplete snippets in VS Code.",
    },
    {
        name: "oneprompt",
        year: 2024,
        group: "libraries",
        href: "https://www.npmjs.com/package/oneprompt",
        repo: "VaibhavAcharya/oneprompt",
        npm: "oneprompt",
        meta: "on npm",
        description: "A super framework for prompt engineering.",
    },
    {
        name: "json-mason",
        year: 2024,
        group: "libraries",
        href: "https://www.npmjs.com/package/json-mason",
        repo: "VaibhavAcharya/json-mason",
        npm: "json-mason",
        meta: "on npm",
        description:
            "A library for safe, predictable structured modifications on JSON data.",
    },
    {
        name: "ChatGPT Everywhere",
        year: 2022,
        group: "smaller",
        href: "https://github.com/VaibhavAcharya/ChatGPT-Everywhere",
        repo: "VaibhavAcharya/ChatGPT-Everywhere",
        media: "chatgpt-everywhere",
        tweet: "https://x.com/VaibhavAcharya_/status/1605453859031089153",
        description:
            "A Chrome plugin that uses the OpenAI API to rewrite the text in input fields on any webpage.",
    },
    {
        name: "Get OG",
        year: 2023,
        group: "smaller",
        href: "https://getog.vercel.app",
        media: "get-og",
        description: "Design eye-catching open graph images in seconds.",
    },
    {
        name: "RaterBay.com",
        year: 2022,
        group: "products",
        href: "https://raterbay.vercel.app",
        ph: "raterbay",
        phRank: 16,
        repo: "VaibhavAcharya/raterbay",
        tweet: "https://x.com/VaibhavAcharya_/status/1540375266648031232",
        meta: "30,000+ visits",
        description: "A platform for receiving and providing resume reviews.",
        detail: "80+ users",
    },
    {
        name: "Jobilist.com",
        year: 2022,
        group: "products",
        ph: "jobilist",
        phRank: 27,
        tweet: "https://x.com/VaibhavAcharya_/status/1539304751367880704",
        meta: "20,000+ visits",
        description:
            "Job search engine that connects job seekers with top employers across the world.",
        detail: "30+ jobs",
    },
    {
        name: "plz",
        year: 2026,
        group: "cli",
        href: "https://github.com/VaibhavAcharya/plz",
        repo: "VaibhavAcharya/plz",
        description:
            "Natural language to shell commands, powered by Claude Code on your system.",
    },
    {
        name: "PerfectAcademia.com",
        year: 2022,
        group: "products",
        repo: "VaibhavAcharya/perfectacademia",
        tweet: "https://x.com/VaibhavAcharya_/status/1583713808035373056",
        description:
            "Crowd-sourced reviews and ratings of universities, anywhere in the world.",
        detail: "9,700+ universities · 204 countries · anonymous reviews",
        note: "The domain lapsed and the deploy no longer boots.",
    },
    {
        name: "AIProductTools.com",
        year: 2023,
        group: "products",
        ph: "ai-product-tools",
        meta: "5,000+ visits",
        description: "AI powered product tools for your e-commerce success.",
        note: "The domain expired and someone else grabbed it.",
    },
    {
        name: "Interesting Cuts",
        year: 2025,
        group: "not launched",
        href: "https://interestingcuts.vercel.app",
        meta: "yet to market",
        description:
            "Turn long-form content into short-form gold. AI-powered video editing that cuts perfect clips for any platform in minutes.",
    },
    {
        name: "Email AI",
        year: 2024,
        group: "smaller",
        ph: "email-ai-2",
        description:
            "Craft beautiful, responsive HTML emails that actually work everywhere. Zero design skills required.",
    },
    {
        name: "Quizming",
        year: 2020,
        group: "smaller",
        href: "https://quizming.vercel.app",
        repo: "VaibhavAcharya/quizming",
        description: "Quiz creation & management web application.",
    },
    {
        name: "Writtic",
        year: 2021,
        group: "smaller",
        href: "https://writtic.vercel.app",
        repo: "VaibhavAcharya/writtic",
        description: "Store & share your notes securely over the web.",
    },
    {
        name: "code-golf",
        year: 2025,
        group: "smaller",
        hidden: true,
        repo: "VaibhavAcharya/code-golf",
        description:
            "Solve programming problems in the fewest characters possible.",
        // code-golf.vercel.app belongs to someone else; this one only ever ran
        // on its own deploy URL.
        note: "An experiment, never taken any further.",
    },
];

/** Everything the pages are allowed to show, in the order set above. */
const SHOWN = PROJECTS.filter((project) => !project.hidden);

export const SHIPPING_GROUPS = GROUP_ORDER.map((label) => ({
    label,
    entries: SHOWN.filter((project) => project.group === label),
})).filter((group) => group.entries.length > 0);

/**
 * One run, no group labels, straight down the order above. That order used to
 * put every ProductHunt launch first, on the grounds that those were the ones
 * with screenshots; pictures no longer depend on a launch, so the evidence a
 * project carries decides instead.
 */
export const SHIPPING_ORDERED = [{ entries: SHOWN }];

export const EDUCATION: Entry[] = [
    {
        name: "Aryan International College",
        meta: "2021 → 2023",
        description: "Bachelors in Computer Application (B.C.A.)",
    },
];
