import { useState, useCallback, useRef, useEffect } from "react";
import {
    CacheDemo,
    DURATION,
    EASING,
    slotBaseStyle,
    requestBtnStyle,
    messageStyle,
} from "./CacheDemo";
import { useReducedMotion } from "./useReducedMotion";

const CAPACITY = 4;
const KEYS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const AUTO_SEQUENCE = ["A", "A", "B", "C", "C", "C", "D", "A", "E", "B", "C"];

interface CacheEntry {
    key: string;
    freq: number;
    order: number;
}

type Mode = "lfu" | "lru";

export function LFUDemo() {
    const [items, setItems] = useState<CacheEntry[]>([]);
    const [flash, setFlash] = useState<string | null>(null);
    const [flashType, setFlashType] = useState<"hit" | "miss" | null>(null);
    const [message, setMessage] = useState(
        "Lowest frequency gets evicted. Ties broken by recency.",
    );
    const [stats, setStats] = useState({ hits: 0, misses: 0 });
    const [mode, setMode] = useState<Mode>("lfu");
    const [isPlaying, setIsPlaying] = useState(false);
    const autoIdx = useRef(0);
    const orderCounter = useRef(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const reduced = useReducedMotion();
    const dur = reduced ? 0 : DURATION;

    const request = useCallback(
        (key: string) => {
            setItems((prev) => {
                const idx = prev.findIndex((e) => e.key === key);

                if (idx !== -1) {
                    setStats((s) => ({ ...s, hits: s.hits + 1 }));
                    setFlashType("hit");
                    const entry = prev[idx];
                    setMessage(
                        `Hit! "${key}" frequency: ${entry.freq} \u2192 ${entry.freq + 1}`,
                    );
                    const next = [...prev];
                    next[idx] = {
                        ...entry,
                        freq: entry.freq + 1,
                        order: orderCounter.current++,
                    };
                    return next;
                }

                setFlashType("miss");
                setStats((s) => ({ ...s, misses: s.misses + 1 }));

                if (prev.length >= CAPACITY) {
                    let evictIdx: number;

                    if (mode === "lfu") {
                        const minFreq = Math.min(...prev.map((e) => e.freq));
                        const candidates = prev
                            .map((e, i) => ({ ...e, i }))
                            .filter((e) => e.freq === minFreq);
                        candidates.sort((a, b) => a.order - b.order);
                        evictIdx = candidates[0].i;
                    } else {
                        evictIdx = prev.reduce(
                            (minI, e, i) =>
                                e.order < prev[minI].order ? i : minI,
                            0,
                        );
                    }

                    const evicted = prev[evictIdx];
                    setMessage(
                        `Miss. Evicting "${evicted.key}" (freq ${evicted.freq}), adding "${key}".`,
                    );
                    const next = [...prev];
                    next.splice(evictIdx, 1);
                    return [
                        ...next,
                        { key, freq: 1, order: orderCounter.current++ },
                    ];
                }

                setMessage(`Miss. Adding "${key}" (freq 1).`);
                return [
                    ...prev,
                    { key, freq: 1, order: orderCounter.current++ },
                ];
            });

            setFlash(key);
            setTimeout(() => {
                setFlash(null);
                setFlashType(null);
            }, dur + 100);
        },
        [dur, mode],
    );

    useEffect(() => {
        if (!isPlaying) {
            if (timerRef.current) clearInterval(timerRef.current);
            return;
        }

        timerRef.current = setInterval(() => {
            if (autoIdx.current >= AUTO_SEQUENCE.length) {
                setIsPlaying(false);
                autoIdx.current = 0;
                return;
            }
            request(AUTO_SEQUENCE[autoIdx.current]);
            autoIdx.current++;
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isPlaying, request]);

    const reset = useCallback(() => {
        setItems([]);
        setStats({ hits: 0, misses: 0 });
        setMessage(
            mode === "lfu"
                ? "Lowest frequency gets evicted. Ties broken by recency."
                : "Least recently used gets evicted.",
        );
        setFlash(null);
        setIsPlaying(false);
        autoIdx.current = 0;
        orderCounter.current = 0;
    }, [mode]);

    const step = useCallback(() => {
        if (autoIdx.current >= AUTO_SEQUENCE.length) {
            autoIdx.current = 0;
        }
        request(AUTO_SEQUENCE[autoIdx.current]);
        autoIdx.current++;
    }, [request]);

    const switchMode = useCallback(
        (m: Mode) => {
            setMode(m);
            setItems([]);
            setStats({ hits: 0, misses: 0 });
            setFlash(null);
            setIsPlaying(false);
            autoIdx.current = 0;
            orderCounter.current = 0;
            setMessage(
                m === "lfu"
                    ? "Lowest frequency gets evicted. Ties broken by recency."
                    : "Least recently used gets evicted.",
            );
        },
        [],
    );

    return (
        <CacheDemo
            title="Popularity contest"
            caption={
                mode === "lfu"
                    ? "LFU: evict the least frequently used item."
                    : "LRU mode: evict the least recently used (for comparison)."
            }
            stats={stats}
            onStep={step}
            onAutoPlay={() => setIsPlaying((p) => !p)}
            onReset={reset}
            isPlaying={isPlaying}
        >
            {/* Mode tabs */}
            <div
                style={{
                    display: "flex",
                    gap: 0,
                    marginBottom: 14,
                    borderBottom: "1px solid oklch(0.85 0.008 80)",
                }}
            >
                {(["lfu", "lru"] as const).map((m) => (
                    <button
                        key={m}
                        onClick={() => switchMode(m)}
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 12,
                            padding: "6px 16px",
                            border: "none",
                            borderBottom:
                                mode === m
                                    ? "2px solid oklch(0.42 0.1 258)"
                                    : "2px solid transparent",
                            background: "transparent",
                            color:
                                mode === m
                                    ? "oklch(0.22 0.008 80)"
                                    : "oklch(0.5 0.01 80)",
                            cursor: "pointer",
                            fontWeight: mode === m ? 600 : 400,
                            fontVariantLigatures: "none",
                        }}
                    >
                        {m.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* Cache slots */}
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                {Array.from({ length: CAPACITY }).map((_, i) => {
                    const entry = items[i];
                    const isFlashing = entry != null && entry.key === flash;
                    let bg = "transparent";
                    let border = "1.5px dashed oklch(0.78 0.01 80)";
                    let color = "oklch(0.78 0.01 80)";

                    if (entry) {
                        bg = "oklch(0.42 0.1 258)";
                        border = "1.5px solid oklch(0.42 0.1 258)";
                        color = "oklch(0.975 0.006 80)";
                    }
                    if (isFlashing && flashType === "hit") {
                        bg = "oklch(0.45 0.15 145)";
                        border = "1.5px solid oklch(0.45 0.15 145)";
                    }

                    return (
                        <div
                            key={i}
                            style={{
                                ...slotBaseStyle,
                                background: bg,
                                border,
                                color,
                                opacity: entry ? 1 : 0.4,
                                transform: isFlashing
                                    ? "scale(1.06)"
                                    : "scale(1)",
                                transition: `all ${dur}ms ${EASING}`,
                                position: "relative",
                            }}
                        >
                            {entry && (
                                <>
                                    <span style={{ fontSize: 15 }}>
                                        {entry.key}
                                    </span>
                                    {mode === "lfu" && (
                                        <span
                                            style={{
                                                position: "absolute",
                                                top: -8,
                                                right: -6,
                                                fontSize: 10,
                                                fontWeight: 700,
                                                background:
                                                    "oklch(0.22 0.008 80)",
                                                color: "oklch(0.975 0.006 80)",
                                                borderRadius: 10,
                                                width: 20,
                                                height: 20,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                transition: `transform ${dur}ms ${EASING}`,
                                                transform: isFlashing
                                                    ? "scale(1.3)"
                                                    : "scale(1)",
                                            }}
                                        >
                                            {entry.freq}
                                        </span>
                                    )}
                                </>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Message */}
            <p style={messageStyle}>{message}</p>

            {/* Sequence preview */}
            <div
                style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "oklch(0.5 0.01 80)",
                    marginBottom: 10,
                    fontVariantLigatures: "none",
                }}
            >
                sequence:{" "}
                {AUTO_SEQUENCE.map((k, i) => (
                    <span
                        key={i}
                        style={{
                            fontWeight: i === autoIdx.current ? 700 : 400,
                            color:
                                i === autoIdx.current
                                    ? "oklch(0.42 0.1 258)"
                                    : "oklch(0.5 0.01 80)",
                            marginRight: 4,
                        }}
                    >
                        {k}
                    </span>
                ))}
            </div>

            {/* Request buttons */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {KEYS.map((key) => (
                    <button
                        key={key}
                        onClick={() => {
                            setIsPlaying(false);
                            request(key);
                        }}
                        style={{
                            ...requestBtnStyle,
                            background: items.some((e) => e.key === key)
                                ? "oklch(0.42 0.1 258 / 10%)"
                                : "oklch(0.975 0.006 80)",
                        }}
                    >
                        {key}
                    </button>
                ))}
            </div>
        </CacheDemo>
    );
}
