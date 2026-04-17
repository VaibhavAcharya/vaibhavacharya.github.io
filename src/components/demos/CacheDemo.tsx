import type { ReactNode, CSSProperties } from "react";

interface CacheDemoProps {
    title: string;
    caption?: string;
    onStep?: () => void;
    onAutoPlay?: () => void;
    onReset: () => void;
    isPlaying?: boolean;
    showControls?: boolean;
    stats?: { hits: number; misses: number };
    children: ReactNode;
}

export function CacheDemo({
    title,
    caption,
    onStep,
    onAutoPlay,
    onReset,
    isPlaying = false,
    showControls = true,
    stats,
    children,
}: CacheDemoProps) {
    return (
        <div data-demo style={containerStyle}>
            <p style={titleStyle}>{title}</p>
            {caption && <p style={captionStyle}>{caption}</p>}

            {children}

            {stats && (
                <div style={statsRowStyle}>
                    <span>
                        hits:{" "}
                        <strong style={{ color: "oklch(0.45 0.15 145)" }}>
                            {stats.hits}
                        </strong>
                    </span>
                    <span>
                        misses:{" "}
                        <strong style={{ color: "oklch(0.55 0.15 30)" }}>
                            {stats.misses}
                        </strong>
                    </span>
                </div>
            )}

            {showControls && (
                <div style={controlBarStyle}>
                    {onStep && (
                        <button onClick={onStep} style={btnStyle}>
                            Step
                        </button>
                    )}
                    {onAutoPlay && (
                        <button onClick={onAutoPlay} style={btnStyle}>
                            {isPlaying ? "Pause" : "Auto"}
                        </button>
                    )}
                    <button onClick={onReset} style={btnStyle}>
                        Reset
                    </button>
                </div>
            )}
        </div>
    );
}

/* -- Shared style objects ------------------------------------------- */

const containerStyle: CSSProperties = {
    border: "1px solid oklch(0.85 0.008 80)",
    borderRadius: 6,
    padding: 20,
    margin: "1.6em 0",
    background: "oklch(0.96 0.005 80)",
};

const titleStyle: CSSProperties = {
    fontFamily: "var(--font-serif)",
    fontStyle: "italic",
    fontSize: 18,
    margin: "0 0 4px",
    color: "oklch(0.22 0.008 80)",
};

const captionStyle: CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontSize: 11,
    color: "oklch(0.5 0.01 80)",
    margin: "0 0 16px",
    fontVariantLigatures: "none",
};

const statsRowStyle: CSSProperties = {
    display: "flex",
    gap: 16,
    fontFamily: "var(--font-mono)",
    fontSize: 12,
    color: "oklch(0.5 0.01 80)",
    marginTop: 12,
    fontVariantLigatures: "none",
};

const controlBarStyle: CSSProperties = {
    display: "flex",
    gap: 8,
    marginTop: 12,
    borderTop: "1px solid oklch(0.85 0.008 80)",
    paddingTop: 12,
};

const btnStyle: CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontSize: 12,
    padding: "6px 14px",
    border: "1px solid oklch(0.78 0.01 80)",
    borderRadius: 4,
    background: "oklch(0.975 0.006 80)",
    color: "oklch(0.22 0.008 80)",
    cursor: "pointer",
    fontVariantLigatures: "none",
};

/* -- Exported shared styles for child demos ------------------------- */

export const DURATION = 300;
export const EASING = "cubic-bezier(0.25, 1, 0.5, 1)";

export const slotBaseStyle: CSSProperties = {
    flex: 1,
    height: 48,
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "var(--font-mono)",
    fontSize: 15,
    fontWeight: 600,
    fontVariantLigatures: "none",
};

export const requestBtnStyle: CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontSize: 13,
    fontWeight: 600,
    width: 36,
    height: 36,
    border: "1px solid oklch(0.78 0.01 80)",
    borderRadius: 4,
    background: "oklch(0.975 0.006 80)",
    color: "oklch(0.22 0.008 80)",
    cursor: "pointer",
    fontVariantLigatures: "none",
};

export const messageStyle: CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontSize: 12,
    color: "oklch(0.5 0.01 80)",
    margin: "0 0 12px",
    minHeight: 18,
    fontVariantLigatures: "none",
};
