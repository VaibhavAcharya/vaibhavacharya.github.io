// src/lib/og.tsx
// Satori JSX template. Returns a React element describing the OG PNG layout.
// Colours are hex equivalents of the spec's OKLCH values (satori is inconsistent
// about oklch support, so hex is safer).

type OgProps = {
    title: string;
    meta: string; // "7 May 2025  ·  vaibhavacharya.github.io" or just the domain on home
};

const PAPER = "#f5efdf"; // oklch(0.975 0.006 80)
const INK = "#2b2720"; // oklch(0.22 0.008 80)
const INK_SOFT = "#7f7864"; // oklch(0.50 0.01 80)
const RULE = "#c5bea8"; // oklch(0.78 0.008 80)
const ACCENT = "#2a3d78"; // oklch(0.42 0.10 258)

export function renderOg({ title, meta }: OgProps) {
    return (
        <div
            style={{
                width: "1200px",
                height: "630px",
                display: "flex",
                flexDirection: "column",
                padding: "72px",
                background: PAPER,
                color: INK,
                position: "relative",
                fontFamily: "Cascadia Code",
            }}
        >
            {/* Masthead, top-left */}
            <div
                style={{
                    fontFamily: "Cascadia Code",
                    fontSize: "22px",
                    color: INK_SOFT,
                    letterSpacing: "3px",
                }}
            >
                vaibhav acharya
            </div>

            {/* Navy tick, top-right */}
            <div
                style={{
                    position: "absolute",
                    top: "84px",
                    right: "72px",
                    width: "56px",
                    height: "3px",
                    background: ACCENT,
                }}
            />

            {/* Spacer pushes title to the bottom half */}
            <div style={{ flex: 1 }} />

            {/* Title */}
            <div
                style={{
                    fontFamily: "Literata",
                    fontStyle: "italic",
                    fontSize: title.length > 40 ? "64px" : "84px",
                    lineHeight: 1.04,
                    letterSpacing: "-2px",
                    color: INK,
                    maxWidth: "900px",
                    display: "flex",
                }}
            >
                {title}
            </div>

            {/* 60% divider rule */}
            <div
                style={{
                    marginTop: "32px",
                    width: "720px",
                    height: "1px",
                    background: RULE,
                }}
            />

            {/* Meta */}
            <div
                style={{
                    marginTop: "18px",
                    fontFamily: "Cascadia Code",
                    fontSize: "22px",
                    color: INK_SOFT,
                    letterSpacing: "1px",
                }}
            >
                {meta}
            </div>
        </div>
    );
}
