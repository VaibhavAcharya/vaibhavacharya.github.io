import { useState, useEffect, useRef, type CSSProperties } from "react";
import { useReducedMotion } from "./useReducedMotion";

interface NodeState {
    label: string;
    value: string;
    pulse: number;
}

const SOURCE_VALUES = ["1", "2", "3", "5", "8", "13", "21"];

export function ReactiveHero() {
    const [count, setCount] = useState<NodeState>({
        label: "count",
        value: "1",
        pulse: 0,
    });
    const [doubled, setDoubled] = useState<NodeState>({
        label: "doubled",
        value: "2",
        pulse: 0,
    });
    const [effect, setEffect] = useState<NodeState>({
        label: "effect",
        value: "log: 2",
        pulse: 0,
    });
    const idxRef = useRef(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const reduced = useReducedMotion();

    useEffect(() => {
        const tick = () => {
            const next = SOURCE_VALUES[idxRef.current % SOURCE_VALUES.length];
            idxRef.current++;
            const n = Number(next);
            setCount((s) => ({ ...s, value: next, pulse: s.pulse + 1 }));
            window.setTimeout(() => {
                setDoubled((s) => ({
                    ...s,
                    value: String(n * 2),
                    pulse: s.pulse + 1,
                }));
            }, reduced ? 0 : 220);
            window.setTimeout(() => {
                setEffect((s) => ({
                    ...s,
                    value: `log: ${n * 2}`,
                    pulse: s.pulse + 1,
                }));
            }, reduced ? 0 : 440);
        };

        tick();
        timerRef.current = setInterval(tick, 1400);
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [reduced]);

    return (
        <div data-demo style={containerStyle}>
            <div style={rowStyle}>
                <Node node={count} kind="signal" />
                <Arrow />
                <Node node={doubled} kind="computed" />
                <Arrow />
                <Node node={effect} kind="effect" />
            </div>
            <p style={captionStyle}>
                set a signal, anything that read it re-runs.
            </p>
        </div>
    );
}

function Node({
    node,
    kind,
}: {
    node: NodeState;
    kind: "signal" | "computed" | "effect";
}) {
    const palette = {
        signal: { bg: "oklch(0.95 0.04 240)", text: "oklch(0.35 0.12 240)" },
        computed: { bg: "oklch(0.95 0.04 90)", text: "oklch(0.4 0.12 90)" },
        effect: { bg: "oklch(0.95 0.05 145)", text: "oklch(0.35 0.12 145)" },
    }[kind];

    return (
        <div
            key={node.pulse}
            style={{
                ...nodeStyle,
                background: palette.bg,
                color: palette.text,
                animation: "rh-pulse 600ms ease-out",
            }}
        >
            <div style={nodeLabelStyle}>{node.label}</div>
            <div style={nodeValueStyle}>{node.value}</div>
            <style>{`
                @keyframes rh-pulse {
                    0% { transform: scale(1); box-shadow: 0 0 0 0 currentColor; }
                    30% { transform: scale(1.04); box-shadow: 0 0 0 4px oklch(from currentColor l c h / 0.15); }
                    100% { transform: scale(1); box-shadow: 0 0 0 0 transparent; }
                }
            `}</style>
        </div>
    );
}

function Arrow() {
    return (
        <div style={arrowStyle} aria-hidden>
            →
        </div>
    );
}

const containerStyle: CSSProperties = {
    border: "1px solid oklch(0.85 0.008 80)",
    borderRadius: 6,
    padding: 20,
    margin: "1.6em 0",
    background: "oklch(0.96 0.005 80)",
};

const rowStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
    justifyContent: "center",
};

const nodeStyle: CSSProperties = {
    flex: "1 1 120px",
    minWidth: 120,
    padding: "12px 14px",
    borderRadius: 6,
    fontFamily: "var(--font-mono)",
    fontVariantLigatures: "none",
    transition: "background 200ms ease",
};

const nodeLabelStyle: CSSProperties = {
    fontSize: 11,
    opacity: 0.7,
    marginBottom: 4,
};

const nodeValueStyle: CSSProperties = {
    fontSize: 18,
    fontWeight: 600,
};

const arrowStyle: CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontSize: 18,
    color: "oklch(0.5 0.01 80)",
};

const captionStyle: CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontSize: 11,
    color: "oklch(0.5 0.01 80)",
    margin: "14px 0 0",
    textAlign: "center",
    fontVariantLigatures: "none",
};
