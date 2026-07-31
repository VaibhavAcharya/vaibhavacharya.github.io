// The galleries that hang in the right margin of the ledger. A gallery is keyed
// by the entry's `media`, or by its ProductHunt slug where it has one, so a
// project does not need a launch to have pictures.
//
// Every frame is in public/shots twice: a 260px thumb for the margin, and a full
// copy that opens when one is clicked. Captions are only set on frames that have
// actually been looked at.

import type { Entry } from "./resume";

interface Shot {
    src: string;
    thumb: string;
    width: number;
    height: number;
    /** What is in the frame, where it is known. */
    caption?: string;
    /** A clip rather than a still. Plays in the viewer, still opens on its own. */
    video?: boolean;
}

type Frame = [
    width: number,
    height: number,
    caption?: string,
    kind?: "video",
];

function gallery(key: string, frames: Frame[]): Shot[] {
    return frames.map(([width, height, caption, kind], index) => ({
        src: `/shots/${key}-${index + 1}.${kind === "video" ? "mp4" : "webp"}`,
        thumb: `/shots/${key}-${index + 1}-t.webp`,
        width,
        height,
        caption,
        video: kind === "video",
    }));
}

export const SHOTS: Record<string, Shot[]> = {
    "saasdata-app": gallery("saasdata-app", [
        [1400, 735, "30k+ companies, 25k+ founders"],
        [1400, 723, "A company profile: revenue, MRR, valuation, headcount"],
        [1400, 723],
        [1400, 723],
        [1400, 723],
        [1400, 723],
    ]),
    "code-gpt-2": gallery("code-gpt-2", [
        [1400, 467, "Make sense of any code, anytime"],
        [1000, 562, "Select the code, run the command, read the explanation", "video"],
    ]),
    "ultra-ai": gallery("ultra-ai", [
        [1400, 735, "Gateway, prompts, caching, fallbacks, rate limits"],
        [1400, 944, "Request log with token counts and the raw call opened up"],
        [1400, 984],
    ]),
    intelcave: gallery("intelcave", [
        [1400, 735, "Business intelligence, redefined using AI"],
        [1400, 875, "The Ask AI console, sitting on top of the schema"],
        [1400, 875],
        [1400, 875],
        [1400, 875],
        [1400, 875],
    ]),
    jobilist: gallery("jobilist", [
        [1400, 1025, "Job board home: search, then one posting card"],
        [1400, 1006, "Employer flow: company details, then the posts"],
        [869, 579, "1,000+ daily visitors, 50+ active jobs, 100+ subscribers"],
        [869, 569, "A posting in full, salary band and all"],
        [869, 579, "Employer onboarding: the company details form"],
        [745, 1253, "Posting a job from a phone"],
    ]),
    "email-ai-2": gallery("email-ai-2", [
        [1400, 735, "Craft responsive HTML emails with AI"],
        [1400, 735, "Prompt on the left, HTML ready to copy on the right"],
    ]),
    "gist-snip": gallery("gist-snip", [
        [1400, 467, "Make your gists actually useful"],
        [
            754,
            356,
            "Gists in the autocomplete, previewed on the right, then dropped into the file",
            "video",
        ],
    ]),
    "ai-product-tools": gallery("ai-product-tools", [
        [1400, 825, "Nine generators: titles, descriptions, keywords, tags, FAQs"],
        [1400, 825],
        [1400, 825],
    ]),
    raterbay: gallery("raterbay", [
        [1400, 1006, "A platform for receiving and providing resume reviews"],
        [1400, 1006, "Latest resumes, 1 to 5 ratings, PDF open in place"],
        [1400, 889],
        [1400, 889],
        [797, 1200, "The home screen on a phone"],
        [835, 1200, "Uploading a resume, and the account controls"],
        [774, 1200, "A resume rated 5 of 5, with the comments under it"],
    ]),
    invocationx: gallery("invocationx", [
        [1400, 1213, "We turn your ideas into reality"],
        [1400, 1213, "The four things on offer: build, design, consultancy, marketing"],
    ]),
    uniboat: gallery("uniboat", [
        [700, 1196, "Grocery shopping, right from your home. Live in Bhilwara"],
        [868, 1156, "The poster that went up around town, QR code and all"],
    ]),
    "chatgpt-everywhere": gallery("chatgpt-everywhere", [
        [1400, 467, "All website, AI powered"],
        [1400, 788, "The button it drops onto the page"],
    ]),
    "get-og": gallery("get-og", [[1200, 640, "The generator's own OG image"]]),
};

export const shotsFor = (entry: Entry): Shot[] =>
    SHOTS[entry.media ?? entry.ph ?? ""] ?? [];

/** The gallery's title card. */
export const card = (key: string): Shot | undefined => SHOTS[key]?.[0];

/** The product itself, where the gallery has more than the title card. */
export const shot = (key: string): Shot | undefined =>
    SHOTS[key]?.[1] ?? SHOTS[key]?.[0];
