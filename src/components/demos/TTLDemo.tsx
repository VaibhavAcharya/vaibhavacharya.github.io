import { useState, useCallback, useRef, useEffect } from "react";
import {
    CacheDemo,
    DURATION,
    EASING,
    slotBaseStyle,
    messageStyle,
} from "./CacheDemo";
import { useReducedMotion } from "./useReducedMotion";

const CAPACITY = 4;
const KEYS = ["A", "B", "C", "D", "E", "F"];

interface CacheEntry {
    key: string;
    ttl: number;
    insertedAt: number;
}

type CleanupMode = "lazy" | "eager";

export function TTLDemo() {
    const [items, setItems] = useState<CacheEntry[]>([]);
    const [mode, setMode] = useState<CleanupMode>("lazy");
    const [message, setMessage] = useState(
        "Add items with different TTLs. Watch them expire.",
    );
    const [selectedTtl, setSelectedTtl] = useState(6000);
    const [now, setNow] = useState(Date.now());
    const animRef = useRef(0);
    const reduced = useReducedMotion();
    const dur = reduced ? 0 : DURATION;

    // Tick every frame for countdown rendering
    useEffect(() => {
        const tick = () => {
            setNow(Date.now());
            animRef.current = requestAnimationFrame(tick);
        };
        animRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(animRef.current);
    }, []);

    // Eager cleanup
    useEffect(() => {
        if (mode !== "eager") return;
        setItems((prev) => prev.filter((e) => now - e.insertedAt < e.ttl));
    }, [now, mode]);

    const addItem = useCallback(
        (key: string) => {
            setItems((prev) => {
                const existing = prev.find((e) => e.key === key);

                // If it exists and is still fresh, it's a hit
                if (existing && now - existing.insertedAt < existing.ttl) {
                    setMessage(`Hit! "${key}" is still fresh.`);
                    return prev;
                }

                // Remove stale entry if any
                const withoutKey = prev.filter((e) => e.key !== key);
                const live = withoutKey.filter(
                    (e) => now - e.insertedAt < e.ttl,
                );

                if (live.length >= CAPACITY) {
                    setMessage("Cache full — wait for items to expire.");
                    return prev;
                }

                setMessage(
                    `Added "${key}" with ${selectedTtl / 1000}s TTL.`,
                );
                return [
                    ...live,
                    { key, ttl: selectedTtl, insertedAt: Date.now() },
                ];
            });
        },
        [selectedTtl, now],
    );

    const accessItem = useCallback(
        (key: string) => {
            setItems((prev) => {
                const entry = prev.find((e) => e.key === key);
                if (!entry) return prev;

                if (now - entry.insertedAt >= entry.ttl) {
                    setMessage(`"${key}" was stale! Removed on access.`);
                    return prev.filter((e) => e.key !== key);
                }

                setMessage(`Hit! "${key}" is still fresh.`);
                return prev;
            });
        },
        [now],
    );

    const reset = useCallback(() => {
        setItems([]);
        setMessage("Add items with different TTLs. Watch them expire.");
    }, []);

    const ttlOptions = [
        { label: "3s", value: 3000 },
        { label: "6s", value: 6000 },
        { label: "10s", value: 10000 },
    ];

    const hasStaleItems = items.some((e) => now - e.insertedAt >= e.ttl);

    return (
        <CacheDemo
            title="Ticking clocks"
            caption={
                mode === "lazy"
                    ? "Lazy: stale items removed only when accessed."
                    : "Eager: stale items removed automatically."
            }
            onReset={reset}
        >
            {/* Mode toggle */}
            <div
                style={{
                    display: "flex",
                    gap: 0,
                    marginBottom: 14,
                    borderBottom: "1px solid oklch(0.85 0.008 80)",
                }}
            >
                {(["lazy", "eager"] as const).map((m) => (
                    <button
                        key={m}
                        onClick={() => setMode(m)}
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
                        {m}
                    </button>
                ))}
            </div>

            {/* Cache slots with countdown */}
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                {Array.from({ length: CAPACITY }).map((_, i) => {
                    const entry = items[i];
                    const elapsed = entry ? now - entry.insertedAt : 0;
                    const remaining = entry
                        ? Math.max(0, entry.ttl - elapsed)
                        : 0;
                    const fraction = entry ? remaining / entry.ttl : 0;
                    const isExpired = entry != null && remaining <= 0;
                    const isStale = isExpired && mode === "lazy";

                    let bg = "transparent";
                    let border = "1.5px dashed oklch(0.78 0.01 80)";
                    let color = "oklch(0.78 0.01 80)";

                    if (entry && !isExpired) {
                        bg = "oklch(0.42 0.1 258)";
                        border = "1.5px solid oklch(0.42 0.1 258)";
                        color = "oklch(0.975 0.006 80)";
                    } else if (isStale) {
                        bg = "oklch(0.78 0.03 30 / 30%)";
                        border = "1.5px dashed oklch(0.6 0.08 30)";
                        color = "oklch(0.5 0.05 30)";
                    }

                    const pieBg =
                        entry && !isExpired
                            ? `conic-gradient(oklch(0.975 0.006 80 / 30%) ${(1 - fraction) * 360}deg, transparent 0)`
                            : undefined;

                    return (
                        <div
                            key={i}
                            onClick={() => entry && accessItem(entry.key)}
                            style={{
                                ...slotBaseStyle,
                                background: bg,
                                backgroundImage: pieBg,
                                border,
                                color,
                                opacity: entry ? 1 : 0.4,
                                transition: `all ${dur}ms ${EASING}`,
                                cursor: entry ? "pointer" : "default",
                                flexDirection: "column",
                                gap: 1,
                                position: "relative",
                            }}
                        >
                            {entry && (
                                <>
                                    <span style={{ fontSize: 15 }}>
                                        {entry.key}
                                    </span>
                                    <span
                                        style={{ fontSize: 9, opacity: 0.8 }}
                                    >
                                        {isExpired
                                            ? "stale"
                                            : `${(remaining / 1000).toFixed(1)}s`}
                                    </span>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Message */}
            <p style={messageStyle}>{message}</p>

            {/* TTL selector */}
            <div
                style={{
                    display: "flex",
                    gap: 6,
                    alignItems: "center",
                    marginBottom: 10,
                }}
            >
                <span
                    style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        color: "oklch(0.5 0.01 80)",
                        fontVariantLigatures: "none",
                    }}
                >
                    TTL:
                </span>
                {ttlOptions.map((opt) => (
                    <button
                        key={opt.value}
                        onClick={() => setSelectedTtl(opt.value)}
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 12,
                            padding: "4px 10px",
                            border:
                                selectedTtl === opt.value
                                    ? "1px solid oklch(0.42 0.1 258)"
                                    : "1px solid oklch(0.78 0.01 80)",
                            borderRadius: 4,
                            background:
                                selectedTtl === opt.value
                                    ? "oklch(0.42 0.1 258 / 10%)"
                                    : "oklch(0.975 0.006 80)",
                            color: "oklch(0.22 0.008 80)",
                            cursor: "pointer",
                            fontVariantLigatures: "none",
                        }}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            {/* Add buttons */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {KEYS.map((key) => (
                    <button
                        key={key}
                        onClick={() => addItem(key)}
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 13,
                            fontWeight: 600,
                            width: 36,
                            height: 36,
                            border: "1px solid oklch(0.78 0.01 80)",
                            borderRadius: 4,
                            background: items.some(
                                (e) =>
                                    e.key === key &&
                                    now - e.insertedAt < e.ttl,
                            )
                                ? "oklch(0.42 0.1 258 / 10%)"
                                : "oklch(0.975 0.006 80)",
                            color: "oklch(0.22 0.008 80)",
                            cursor: "pointer",
                            fontVariantLigatures: "none",
                        }}
                    >
                        {key}
                    </button>
                ))}
            </div>

            {mode === "lazy" && hasStaleItems && (
                <p
                    style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        color: "oklch(0.55 0.1 30)",
                        marginTop: 8,
                        fontVariantLigatures: "none",
                    }}
                >
                    Stale items visible — click one to trigger lazy eviction.
                </p>
            )}
        </CacheDemo>
    );
}
