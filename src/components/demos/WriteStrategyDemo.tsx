import { useState, useCallback, useRef, useEffect } from "react";
import { CacheDemo, EASING } from "./CacheDemo";
import { useReducedMotion } from "./useReducedMotion";

type Strategy = "write-through" | "write-back";
type Phase =
    | "idle"
    | "to-cache"
    | "cache-to-db"
    | "responding"
    | "deferred-write"
    | "crash";

const DOT_SIZE = 10;

export function WriteStrategyDemo() {
    const [strategy, setStrategy] = useState<Strategy>("write-through");
    const [phase, setPhase] = useState<Phase>("idle");
    const [writeCount, setWriteCount] = useState(0);
    const [latency, setLatency] = useState(0);
    const [cacheData, setCacheData] = useState<string | null>(null);
    const [dbData, setDbData] = useState<string | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);
    const t0Ref = useRef(0);
    const reduced = useReducedMotion();
    const speed = reduced ? 10 : 600;

    const clearTimers = useCallback(() => {
        timerRef.current.forEach(clearTimeout);
        timerRef.current = [];
    }, []);

    const schedule = useCallback((fn: () => void, delay: number) => {
        timerRef.current.push(setTimeout(fn, delay));
    }, []);

    useEffect(() => clearTimers, [clearTimers]);

    const handleWrite = useCallback(() => {
        if (phase !== "idle") return;

        clearTimers();
        const item = `v${writeCount + 1}`;
        setWriteCount((c) => c + 1);
        setLatency(0);
        t0Ref.current = Date.now();

        setPhase("to-cache");

        if (strategy === "write-through") {
            schedule(() => {
                setCacheData(item);
                setPhase("cache-to-db");
            }, speed);

            schedule(() => {
                setDbData(item);
                setPhase("responding");
                setLatency(
                    Math.round(
                        (Date.now() - t0Ref.current) * (reduced ? 100 : 1),
                    ),
                );
            }, speed * 2);

            schedule(() => setPhase("idle"), speed * 3);
        } else {
            schedule(() => {
                setCacheData(item);
                setPhase("responding");
                setLatency(
                    Math.round(
                        (Date.now() - t0Ref.current) * (reduced ? 100 : 1),
                    ),
                );
            }, speed);

            schedule(() => setPhase("deferred-write"), speed * 2);
            schedule(() => setDbData(item), speed * 3);
            schedule(() => setPhase("idle"), speed * 3.5);
        }
    }, [phase, strategy, writeCount, speed, reduced, clearTimers, schedule]);

    const simulateCrash = useCallback(() => {
        if (strategy !== "write-back") return;
        clearTimers();
        setCacheData(null);
        setPhase("crash");
        setTimeout(() => setPhase("idle"), speed * 2);
    }, [strategy, speed, clearTimers]);

    const reset = useCallback(() => {
        clearTimers();
        setPhase("idle");
        setWriteCount(0);
        setLatency(0);
        setCacheData(null);
        setDbData(null);
    }, [clearTimers]);

    // Dot position as percentage of the flow row
    const dotLeft = (() => {
        switch (phase) {
            case "to-cache":
                return "28%";
            case "cache-to-db":
                return "72%";
            case "responding":
                return "8%";
            case "deferred-write":
                return "72%";
            default:
                return "-20px";
        }
    })();

    const mono: React.CSSProperties = {
        fontFamily: "var(--font-mono)",
        fontVariantLigatures: "none",
    };

    const boxStyle: React.CSSProperties = {
        flex: 1,
        height: 56,
        borderRadius: 6,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        ...mono,
        fontSize: 11,
        minWidth: 0,
    };

    const arrowStyle: React.CSSProperties = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...mono,
        fontSize: 11,
        color: "oklch(0.7 0.01 80)",
        flexShrink: 0,
        width: 24,
    };

    return (
        <CacheDemo
            title="The data highway"
            caption="Write-through sends data everywhere before responding. Write-back responds fast but risks loss."
            onReset={reset}
        >
            {/* Strategy toggle */}
            <div
                style={{
                    display: "flex",
                    gap: 0,
                    marginBottom: 14,
                    borderBottom: "1px solid oklch(0.85 0.008 80)",
                }}
            >
                {(["write-through", "write-back"] as const).map((s) => (
                    <button
                        key={s}
                        onClick={() => {
                            setStrategy(s);
                            reset();
                        }}
                        style={{
                            ...mono,
                            fontSize: 12,
                            padding: "6px 16px",
                            border: "none",
                            borderBottom:
                                strategy === s
                                    ? "2px solid oklch(0.42 0.1 258)"
                                    : "2px solid transparent",
                            background: "transparent",
                            color:
                                strategy === s
                                    ? "oklch(0.22 0.008 80)"
                                    : "oklch(0.5 0.01 80)",
                            cursor: "pointer",
                            fontWeight: strategy === s ? 600 : 400,
                        }}
                    >
                        {s}
                    </button>
                ))}
            </div>

            {/* Flow diagram - flexbox layout */}
            <div style={{ position: "relative", marginBottom: 16 }}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0,
                    }}
                >
                    {/* Client */}
                    <div
                        style={{
                            ...boxStyle,
                            border: "1.5px solid oklch(0.78 0.01 80)",
                            color: "oklch(0.22 0.008 80)",
                        }}
                    >
                        <span style={{ fontWeight: 600 }}>Client</span>
                    </div>

                    <div style={arrowStyle}>{"\u2192"}</div>

                    {/* Cache */}
                    <div
                        style={{
                            ...boxStyle,
                            border:
                                phase === "crash"
                                    ? "1.5px solid oklch(0.55 0.15 15)"
                                    : "1.5px solid oklch(0.42 0.1 258)",
                            background:
                                phase === "crash"
                                    ? "oklch(0.55 0.15 15 / 10%)"
                                    : cacheData
                                      ? "oklch(0.42 0.1 258 / 8%)"
                                      : "transparent",
                            transition: `all 300ms ${EASING}`,
                        }}
                    >
                        <span
                            style={{
                                fontWeight: 600,
                                color: "oklch(0.22 0.008 80)",
                            }}
                        >
                            Cache
                        </span>
                        {cacheData && (
                            <span
                                style={{
                                    fontSize: 10,
                                    color:
                                        phase === "crash"
                                            ? "oklch(0.55 0.15 15)"
                                            : "oklch(0.42 0.1 258)",
                                }}
                            >
                                {phase === "crash" ? "LOST" : cacheData}
                            </span>
                        )}
                    </div>

                    <div style={arrowStyle}>{"\u2192"}</div>

                    {/* Database */}
                    <div
                        style={{
                            ...boxStyle,
                            border: "1.5px solid oklch(0.78 0.01 80)",
                            background: dbData
                                ? "oklch(0.78 0.01 80 / 20%)"
                                : "transparent",
                            transition: `all 300ms ${EASING}`,
                        }}
                    >
                        <span
                            style={{
                                fontWeight: 600,
                                color: "oklch(0.22 0.008 80)",
                            }}
                        >
                            Database
                        </span>
                        {dbData && (
                            <span
                                style={{
                                    fontSize: 10,
                                    color: "oklch(0.5 0.01 80)",
                                }}
                            >
                                {dbData}
                            </span>
                        )}
                    </div>
                </div>

                {/* Animated dot */}
                {phase !== "idle" && phase !== "crash" && (
                    <div
                        style={{
                            position: "absolute",
                            top: 28 - DOT_SIZE / 2,
                            left: dotLeft,
                            width: DOT_SIZE,
                            height: DOT_SIZE,
                            borderRadius: "50%",
                            background: "oklch(0.55 0.2 145)",
                            transition: `left ${speed}ms ${EASING}`,
                            zIndex: 2,
                        }}
                    />
                )}
            </div>

            {/* Latency */}
            <div
                style={{
                    ...mono,
                    fontSize: 11,
                    color: "oklch(0.5 0.01 80)",
                    marginBottom: 12,
                }}
            >
                response: {latency > 0 ? `${latency}ms` : "\u2014"}
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button
                    onClick={handleWrite}
                    disabled={phase !== "idle"}
                    style={{
                        ...mono,
                        fontSize: 12,
                        padding: "6px 14px",
                        border: "1px solid oklch(0.42 0.1 258)",
                        borderRadius: 4,
                        background:
                            phase !== "idle"
                                ? "oklch(0.85 0.008 80)"
                                : "oklch(0.42 0.1 258 / 10%)",
                        color: "oklch(0.22 0.008 80)",
                        cursor: phase !== "idle" ? "not-allowed" : "pointer",
                    }}
                >
                    Write v{writeCount + 1}
                </button>
                {strategy === "write-back" && (
                    <button
                        onClick={simulateCrash}
                        disabled={!cacheData || dbData === cacheData}
                        style={{
                            ...mono,
                            fontSize: 12,
                            padding: "6px 14px",
                            border: "1px solid oklch(0.55 0.12 15)",
                            borderRadius: 4,
                            background: "oklch(0.55 0.12 15 / 10%)",
                            color: "oklch(0.4 0.1 15)",
                            cursor:
                                !cacheData || dbData === cacheData
                                    ? "not-allowed"
                                    : "pointer",
                        }}
                    >
                        Simulate crash
                    </button>
                )}
            </div>
        </CacheDemo>
    );
}
