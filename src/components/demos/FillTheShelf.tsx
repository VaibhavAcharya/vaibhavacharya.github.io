import { useState, useCallback } from "react";
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

export function FillTheShelf() {
    const [items, setItems] = useState<string[]>([]);
    const [flash, setFlash] = useState<string | null>(null);
    const [flashType, setFlashType] = useState<"hit" | "miss" | null>(null);
    const [message, setMessage] = useState("Click a letter to request it.");
    const [stats, setStats] = useState({ hits: 0, misses: 0 });
    const reduced = useReducedMotion();
    const dur = reduced ? 0 : DURATION;

    const request = useCallback(
        (key: string) => {
            const isHit = items.includes(key);

            if (isHit) {
                setStats((s) => ({ ...s, hits: s.hits + 1 }));
                setMessage(`Hit! "${key}" was already cached.`);
                setFlash(key);
                setFlashType("hit");
            } else {
                setStats((s) => ({ ...s, misses: s.misses + 1 }));
                if (items.length >= CAPACITY) {
                    setMessage(
                        `Miss. Cache full — evicting "${items[0]}", adding "${key}".`,
                    );
                    setItems((prev) => [...prev.slice(1), key]);
                } else {
                    setMessage(`Miss. Adding "${key}" to the cache.`);
                    setItems((prev) => [...prev, key]);
                }
                setFlash(key);
                setFlashType("miss");
            }

            setTimeout(() => {
                setFlash(null);
                setFlashType(null);
            }, dur + 100);
        },
        [items, dur],
    );

    const reset = useCallback(() => {
        setItems([]);
        setStats({ hits: 0, misses: 0 });
        setMessage("Click a letter to request it.");
        setFlash(null);
    }, []);

    return (
        <CacheDemo
            title="Fill the shelf"
            caption="A FIFO cache with 4 slots. What happens when it's full?"
            stats={stats}
            onReset={reset}
        >
            {/* Cache slots */}
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
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
                            {item ?? i + 1}
                        </div>
                    );
                })}
            </div>

            {/* Message */}
            <p style={messageStyle}>{message}</p>

            {/* Request buttons */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {KEYS.map((key) => (
                    <button
                        key={key}
                        onClick={() => request(key)}
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
