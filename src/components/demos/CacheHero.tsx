import { useState, useEffect, useRef } from "react";
import { useReducedMotion } from "./useReducedMotion";

// Sequence: cold start then warming up
const SEQUENCE: [string, boolean][] = [
    ["A", false],
    ["B", false],
    ["C", false],
    ["A", true],
    ["D", false],
    ["B", true],
    ["A", true],
    ["E", false],
    ["C", true],
    ["B", true],
    ["D", true],
    ["A", true],
    ["F", false],
    ["E", true],
    ["C", true],
    ["B", true],
];

interface Bar {
    id: number;
    key: string;
    hit: boolean;
    ms: number;
}

const VISIBLE = 6;

export function CacheHero() {
    const [bars, setBars] = useState<Bar[]>([]);
    const idRef = useRef(0);
    const idxRef = useRef(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const reduced = useReducedMotion();

    useEffect(() => {
        const tick = () => {
            const [key, hit] =
                SEQUENCE[idxRef.current % SEQUENCE.length];
            idxRef.current++;

            const ms = hit
                ? Math.floor(Math.random() * 3) + 1
                : Math.floor(Math.random() * 80) + 150;

            setBars((prev) =>
                [{ id: idRef.current++, key, hit, ms }, ...prev].slice(
                    0,
                    VISIBLE,
                ),
            );
        };

        timerRef.current = setInterval(tick, 500);
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const mono: React.CSSProperties = {
        fontFamily: "var(--font-mono)",
        fontVariantLigatures: "none",
    };

    const hitFillMs = reduced ? 0 : 80;
    const missFillMs = reduced ? 0 : 700;

    return (
        <div
            data-demo
            style={{
                border: "1px solid oklch(0.85 0.008 80)",
                borderRadius: 6,
                padding: "14px 16px",
                margin: "0 0 1.6em",
                background: "oklch(0.96 0.005 80)",
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 5,
                    minHeight: VISIBLE * 25,
                }}
            >
                {bars.map((bar) => (
                    <div
                        key={bar.id}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            height: 20,
                        }}
                    >
                        {/* Key */}
                        <span
                            style={{
                                ...mono,
                                fontSize: 12,
                                fontWeight: 600,
                                width: "1.5ch",
                                color: bar.hit
                                    ? "oklch(0.4 0.12 145)"
                                    : "oklch(0.5 0.08 50)",
                                textAlign: "center",
                                flexShrink: 0,
                            }}
                        >
                            {bar.key}
                        </span>

                        {/* Track */}
                        <div
                            style={{
                                flex: 1,
                                height: 6,
                                borderRadius: 3,
                                background: "oklch(0.9 0.005 80)",
                                overflow: "hidden",
                            }}
                        >
                            <div
                                style={{
                                    height: "100%",
                                    borderRadius: 3,
                                    background: bar.hit
                                        ? "oklch(0.45 0.15 145)"
                                        : "oklch(0.6 0.1 50)",
                                    animation: `hero-fill ${bar.hit ? hitFillMs : missFillMs}ms cubic-bezier(0.25, 1, 0.5, 1) forwards`,
                                }}
                            />
                        </div>

                        {/* Response time */}
                        <span
                            style={{
                                ...mono,
                                fontSize: 10,
                                width: "5ch",
                                textAlign: "right",
                                flexShrink: 0,
                                color: bar.hit
                                    ? "oklch(0.4 0.12 145)"
                                    : "oklch(0.5 0.08 50)",
                            }}
                        >
                            {bar.ms}ms
                        </span>

                        {/* Hit/miss label */}
                        <span
                            style={{
                                ...mono,
                                fontSize: 9,
                                width: "3ch",
                                flexShrink: 0,
                                color: bar.hit
                                    ? "oklch(0.45 0.15 145)"
                                    : "oklch(0.55 0.1 50)",
                            }}
                        >
                            {bar.hit ? "hit" : "miss"}
                        </span>
                    </div>
                ))}
            </div>

            <style>{`
                @keyframes hero-fill {
                    from { width: 0; }
                    to { width: 100%; }
                }
            `}</style>
        </div>
    );
}
