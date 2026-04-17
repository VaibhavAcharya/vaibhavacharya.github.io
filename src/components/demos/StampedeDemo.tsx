import { useState, useCallback, useRef, useEffect } from "react";
import { CacheDemo, EASING } from "./CacheDemo";
import { useReducedMotion } from "./useReducedMotion";

/*
  No-lock story:
    warm → arriving → expiring → stampede → overloaded → idle

  Lock story:
    warm → arriving → expiring → lock-queued → lock-fetching → lock-returning → resolved → idle
*/
type Phase =
    | "idle"
    | "warm"
    | "arriving"      // dots pause at cache (last good moment)
    | "expiring"      // cache dies, dots slide back to start
    | "stampede"      // no-lock: dots rush to DB
    | "overloaded"    // no-lock: DB shakes
    | "lock-queued"   // lock: dots pile up at cache
    | "lock-fetching" // lock: one dot goes to DB
    | "lock-returning"// lock: dot returns, cache rebuilds
    | "resolved";     // lock: all served

const CONTAINER_H = 140;
const DOT_COUNT = 10;
const CENTER_Y = CONTAINER_H / 2 - 4;

export function StampedeDemo() {
    const [phase, setPhase] = useState<Phase>("idle");
    const [lockMode, setLockMode] = useState(false);
    const [dbLoad, setDbLoad] = useState(0);
    const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);
    const reduced = useReducedMotion();
    const speed = reduced ? 50 : 500;

    const clearTimers = useCallback(() => {
        timerRef.current.forEach(clearTimeout);
        timerRef.current = [];
    }, []);

    const schedule = useCallback((fn: () => void, delay: number) => {
        timerRef.current.push(setTimeout(fn, delay));
    }, []);

    useEffect(() => clearTimers, [clearTimers]);

    const startSimulation = useCallback(() => {
        clearTimers();
        setDbLoad(0);
        setPhase("warm");

        // Dots arrive at cache, brief happy pause
        schedule(() => setPhase("arriving"), speed * 4);

        // Cache expires, dots slide back
        schedule(() => setPhase("expiring"), speed * 6);

        if (lockMode) {
            // Dots come back to cache, pile up
            schedule(() => setPhase("lock-queued"), speed * 8);

            // One dot starts journey to DB
            schedule(() => {
                setPhase("lock-fetching");
                setDbLoad(1);
            }, speed * 9.5);

            // Dot returns from DB
            schedule(() => {
                setPhase("lock-returning");
                setDbLoad(0);
            }, speed * 14);

            // All served
            schedule(() => setPhase("resolved"), speed * 17);
            schedule(() => setPhase("idle"), speed * 20);
        } else {
            // New requests stampede to DB
            schedule(() => {
                setPhase("stampede");
                setDbLoad(DOT_COUNT);
            }, speed * 8);

            schedule(() => setPhase("overloaded"), speed * 10);
            schedule(() => setPhase("idle"), speed * 13);
        }
    }, [clearTimers, schedule, lockMode, speed]);

    const reset = useCallback(() => {
        clearTimers();
        setPhase("idle");
        setDbLoad(0);
    }, [clearTimers]);

    const mono: React.CSSProperties = {
        fontFamily: "var(--font-mono)",
        fontVariantLigatures: "none",
    };

    const isActive = phase !== "idle";

    const cacheOk = phase === "warm" || phase === "arriving" || phase === "resolved";
    const cacheExpired = [
        "expiring", "stampede", "overloaded",
        "lock-queued", "lock-fetching",
    ].includes(phase);
    const cacheRebuilding = phase === "lock-returning";
    const dbOverloaded = phase === "overloaded";
    const dbBusy = phase === "stampede" || phase === "lock-fetching";

    // ---- Dot positioning ----

    const getDotTop = (i: number): number => {
        if (
            i === 0 &&
            ["lock-queued", "lock-fetching", "lock-returning"].includes(phase)
        )
            return CENTER_Y;

        if (
            i > 0 &&
            ["lock-queued", "lock-fetching", "lock-returning"].includes(phase)
        ) {
            const row = (i - 1) % 3;
            const col = Math.floor((i - 1) / 3);
            return 20 + row * 38 + col * 6;
        }

        return 18 + (i % 3) * 38 + Math.floor(i / 3) * 4;
    };

    const getDotLeft = (i: number): string => {
        switch (phase) {
            case "idle":
            case "expiring":
                return "4%";

            case "warm":
            case "resolved":
                return "4%"; // animation handles movement

            case "arriving":
                return "28%"; // parked at cache

            case "lock-queued":
                return "28%";

            case "lock-fetching":
                return i === 0 ? "76%" : "28%";

            case "lock-returning":
                return "28%";

            case "stampede":
            case "overloaded":
                return "4%"; // animation handles movement

            default:
                return "4%";
        }
    };

    const getDotTransition = (i: number): string => {
        const base = `background ${speed}ms ${EASING}, opacity ${speed}ms ${EASING}`;

        // Arriving: dots slide from wherever animation left them to cache
        if (phase === "arriving")
            return `left ${speed}ms ${EASING}, ${base}`;

        // Expiring: dots slide back to start
        if (phase === "expiring")
            return `left ${speed * 1.5}ms ${EASING}, ${base}`;

        // Lock queued: dots slide to cache
        if (phase === "lock-queued")
            return `left ${speed}ms ${EASING}, top ${speed}ms ${EASING}, ${base}`;

        // Lock fetching: fetcher slow, waiters quick
        if (phase === "lock-fetching") {
            if (i === 0) return `left 2s ${EASING}, top ${speed}ms ${EASING}, ${base}`;
            return `left ${speed}ms ${EASING}, top ${speed}ms ${EASING}, ${base}`;
        }

        // Lock returning: fetcher slow back
        if (phase === "lock-returning") {
            if (i === 0) return `left 1.8s ${EASING}, ${base}`;
            return base;
        }

        return `left ${speed}ms ${EASING}, ${base}`;
    };

    const getDotAnimation = (i: number): string => {
        if (phase === "warm" || phase === "resolved")
            return `stampede-to-cache 1.6s ease-in-out infinite ${i * 0.14}s`;

        if (phase === "stampede" || phase === "overloaded")
            return `stampede-to-db 1.6s ease-in-out infinite ${i * 0.14}s`;

        if (
            i > 0 &&
            ["lock-queued", "lock-fetching", "lock-returning"].includes(phase)
        )
            return `stampede-pulse 1.2s ease-in-out infinite ${i * 0.1}s`;

        return "none";
    };

    const getDotColor = (i: number): string => {
        if (phase === "warm" || phase === "arriving" || phase === "resolved")
            return "oklch(0.45 0.15 145)";

        if (phase === "expiring")
            return "oklch(0.6 0.08 50)";

        if (phase === "stampede" || phase === "overloaded")
            return "oklch(0.55 0.15 15)";

        if (phase === "lock-queued" || phase === "lock-fetching")
            return i === 0 ? "oklch(0.42 0.1 258)" : "oklch(0.6 0.03 80)";

        if (phase === "lock-returning")
            return i === 0 ? "oklch(0.45 0.15 145)" : "oklch(0.6 0.03 80)";

        return "oklch(0.42 0.1 258)";
    };

    const getDotOpacity = (_i: number): number => {
        if (phase === "idle") return 0.2;
        if (phase === "expiring") return 0.5;
        return 1;
    };

    const getDotSize = (i: number): number => {
        if (i === 0 && (phase === "lock-fetching" || phase === "lock-returning"))
            return 10;
        return 7;
    };

    const phaseLabel = (() => {
        switch (phase) {
            case "idle": return "ready";
            case "warm": return "requests served from cache";
            case "arriving": return "requests arriving at cache";
            case "expiring": return "cache entry expired. requests return empty.";
            case "stampede": return "new requests rush past dead cache to database!";
            case "overloaded": return "database overloaded!";
            case "lock-queued": return "requests arrive at cache. all miss.";
            case "lock-fetching": return "one request goes to the database. others wait.";
            case "lock-returning": return "data fetched. rebuilding cache\u2026";
            case "resolved": return "done. database handled 1 query total.";
            default: return "";
        }
    })();

    return (
        <CacheDemo
            title="The stampede"
            caption="What happens when a popular cache entry expires and everyone comes knocking?"
            onReset={reset}
            showControls={false}
        >
            <div style={{ display: "flex", alignItems: "center", marginBottom: 14 }}>
                <label
                    style={{
                        ...mono, fontSize: 11,
                        color: lockMode ? "oklch(0.42 0.1 258)" : "oklch(0.5 0.01 80)",
                        cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
                    }}
                >
                    <input
                        type="checkbox"
                        checked={lockMode}
                        onChange={(e) => setLockMode(e.target.checked)}
                        disabled={isActive}
                    />
                    lock (single-flight)
                </label>
            </div>

            <div
                style={{
                    position: "relative", height: CONTAINER_H,
                    border: "1px solid oklch(0.85 0.008 80)", borderRadius: 6,
                    marginBottom: 12, overflow: "hidden", background: "oklch(0.975 0.006 80)",
                }}
            >
                {Array.from({ length: DOT_COUNT }).map((_, i) => {
                    const size = getDotSize(i);
                    return (
                        <div
                            key={i}
                            style={{
                                position: "absolute",
                                top: getDotTop(i),
                                left: getDotLeft(i),
                                width: size, height: size,
                                borderRadius: "50%",
                                background: getDotColor(i),
                                opacity: getDotOpacity(i),
                                animation: getDotAnimation(i),
                                transition: getDotTransition(i),
                                zIndex: 1,
                            }}
                        />
                    );
                })}

                {/* Cache box */}
                <div
                    style={{
                        position: "absolute", left: "35%", top: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 72, height: 52, borderRadius: 6,
                        border: cacheOk
                            ? "1.5px solid oklch(0.45 0.15 145)"
                            : cacheRebuilding
                              ? "1.5px solid oklch(0.45 0.15 145)"
                              : cacheExpired
                                ? "1.5px dashed oklch(0.55 0.12 15)"
                                : "1.5px solid oklch(0.78 0.01 80)",
                        display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center",
                        ...mono, fontSize: 11,
                        background: cacheOk || cacheRebuilding
                            ? "oklch(0.45 0.15 145 / 8%)" : "oklch(0.975 0.006 80)",
                        transition: `all ${speed}ms ${EASING}`, zIndex: 2,
                    }}
                >
                    <span style={{ fontWeight: 600, fontSize: 12 }}>Cache</span>
                    <span style={{
                        fontSize: 9,
                        color: cacheOk || cacheRebuilding
                            ? "oklch(0.45 0.15 145)"
                            : cacheExpired ? "oklch(0.55 0.12 15)" : "oklch(0.5 0.01 80)",
                    }}>
                        {cacheOk ? "warm" : cacheRebuilding ? "rebuilding" : cacheExpired ? "EXPIRED" : "idle"}
                    </span>
                </div>

                {/* Database box */}
                <div
                    style={{
                        position: "absolute", left: "80%", top: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 72, height: 52, borderRadius: 6,
                        border: dbOverloaded
                            ? "1.5px solid oklch(0.55 0.15 15)"
                            : "1.5px solid oklch(0.78 0.01 80)",
                        display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center",
                        ...mono, fontSize: 11,
                        background: dbOverloaded
                            ? "oklch(0.55 0.15 15 / 15%)"
                            : dbBusy ? "oklch(0.42 0.1 258 / 8%)" : "oklch(0.975 0.006 80)",
                        transition: `all ${speed}ms ${EASING}`,
                        animation: dbOverloaded ? "stampede-shake 0.1s ease-in-out 5" : "none",
                        zIndex: 2,
                    }}
                >
                    <span style={{ fontWeight: 600, fontSize: 12 }}>Database</span>
                    <span style={{
                        fontSize: 9,
                        color: dbOverloaded ? "oklch(0.55 0.15 15)" : "oklch(0.5 0.01 80)",
                    }}>
                        {dbOverloaded ? "OVERLOADED" : dbLoad > 0 ? "1 query" : "idle"}
                    </span>
                </div>

                {/* Phase label */}
                <div style={{
                    position: "absolute", bottom: 8, left: "50%",
                    transform: "translateX(-50%)", ...mono,
                    fontSize: 10, color: "oklch(0.5 0.01 80)",
                    whiteSpace: "nowrap", zIndex: 3,
                }}>
                    {phaseLabel}
                </div>
            </div>

            <button
                onClick={isActive ? reset : startSimulation}
                style={{
                    ...mono, fontSize: 12, padding: "6px 14px",
                    border: "1px solid oklch(0.42 0.1 258)", borderRadius: 4,
                    background: "oklch(0.42 0.1 258 / 10%)",
                    color: "oklch(0.22 0.008 80)", cursor: "pointer",
                }}
            >
                {isActive ? "Reset" : "Start simulation"}
            </button>

            <style>{`
                @keyframes stampede-to-cache {
                    0% { left: 4%; opacity: 0; }
                    12% { opacity: 1; }
                    75% { opacity: 1; }
                    100% { left: 30%; opacity: 0; }
                }
                @keyframes stampede-to-db {
                    0% { left: 4%; opacity: 0; }
                    8% { opacity: 1; }
                    88% { opacity: 1; }
                    100% { left: 76%; opacity: 0; }
                }
                @keyframes stampede-pulse {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.75; }
                }
                @keyframes stampede-shake {
                    0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
                    25% { transform: translate(calc(-50% - 3px), -50%) rotate(-1deg); }
                    75% { transform: translate(calc(-50% + 3px), -50%) rotate(1deg); }
                }
            `}</style>
        </CacheDemo>
    );
}
