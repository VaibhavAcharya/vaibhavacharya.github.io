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
const AUTO_SEQUENCE = ["A", "B", "C", "D", "A", "E", "B", "C", "D", "E", "A"];

export function LRUDemo() {
    const [items, setItems] = useState<string[]>([]); // most-recent-first
    const [flash, setFlash] = useState<string | null>(null);
    const [flashType, setFlashType] = useState<"hit" | "miss" | null>(null);
    const [message, setMessage] = useState("Most recent item is on the left.");
    const [stats, setStats] = useState({ hits: 0, misses: 0 });
    const [isPlaying, setIsPlaying] = useState(false);
    const autoIdx = useRef(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const reduced = useReducedMotion();
    const dur = reduced ? 0 : DURATION;

    const request = useCallback(
        (key: string) => {
            setItems((prev) => {
                const idx = prev.indexOf(key);
                if (idx !== -1) {
                    setStats((s) => ({ ...s, hits: s.hits + 1 }));
                    setMessage(
                        `Hit! Moving "${key}" to front (most recent).`,
                    );
                    setFlashType("hit");
                    const next = [...prev];
                    next.splice(idx, 1);
                    return [key, ...next];
                }

                setFlashType("miss");
                if (prev.length >= CAPACITY) {
                    const evicted = prev[prev.length - 1];
                    setMessage(
                        `Miss. Evicting "${evicted}" (least recent), adding "${key}".`,
                    );
                    setStats((s) => ({ ...s, misses: s.misses + 1 }));
                    return [key, ...prev.slice(0, CAPACITY - 1)];
                }

                setMessage(`Miss. Adding "${key}" to front.`);
                setStats((s) => ({ ...s, misses: s.misses + 1 }));
                return [key, ...prev];
            });

            setFlash(key);
            setTimeout(() => {
                setFlash(null);
                setFlashType(null);
            }, dur + 100);
        },
        [dur],
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
        setMessage("Most recent item is on the left.");
        setFlash(null);
        setIsPlaying(false);
        autoIdx.current = 0;
    }, []);

    const step = useCallback(() => {
        if (autoIdx.current >= AUTO_SEQUENCE.length) {
            autoIdx.current = 0;
        }
        request(AUTO_SEQUENCE[autoIdx.current]);
        autoIdx.current++;
    }, [request]);

    return (
        <CacheDemo
            title="The bouncer's list"
            caption="LRU: most recent at the front, least recent gets evicted."
            stats={stats}
            onStep={step}
            onAutoPlay={() => setIsPlaying((p) => !p)}
            onReset={reset}
            isPlaying={isPlaying}
        >
            {/* Labels */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    color: "oklch(0.5 0.01 80)",
                    marginBottom: 4,
                    fontVariantLigatures: "none",
                }}
            >
                <span>most recent</span>
                <span>evict me</span>
            </div>

            {/* Cache slots with arrows */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    marginBottom: 12,
                }}
            >
                {Array.from({ length: CAPACITY }).map((_, i) => {
                    const item = items[i];
                    const isFlashing = item != null && item === flash;
                    let bg = "transparent";
                    let border = "1.5px dashed oklch(0.78 0.01 80)";
                    let color = "oklch(0.78 0.01 80)";

                    if (item) {
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
                                display: "flex",
                                alignItems: "center",
                                flex: 1,
                            }}
                        >
                            <div
                                style={{
                                    ...slotBaseStyle,
                                    background: bg,
                                    border,
                                    color,
                                    opacity: item ? 1 : 0.4,
                                    transform: isFlashing
                                        ? "scale(1.06)"
                                        : "scale(1)",
                                    transition: `all ${dur}ms ${EASING}`,
                                }}
                            >
                                {item ?? ""}
                            </div>
                            {i < CAPACITY - 1 && (
                                <span
                                    style={{
                                        color: "oklch(0.7 0.01 80)",
                                        fontSize: 14,
                                        margin: "0 2px",
                                        flexShrink: 0,
                                    }}
                                >
                                    {"\u2192"}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Message */}
            <p style={messageStyle}>{message}</p>

            {/* Auto-play sequence preview */}
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

            {/* Manual request buttons */}
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
                            background: items.includes(key)
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
