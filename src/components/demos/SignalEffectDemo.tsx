import { useState, useCallback, type CSSProperties } from "react";
import { CacheDemo, requestBtnStyle, messageStyle } from "./CacheDemo";

interface LogLine {
    id: number;
    text: string;
}

const NAMES = ["Ada", "Lin", "Sam", "Ravi"];

export function SignalEffectDemo() {
    const [count, setCount] = useState(0);
    const [nameIdx, setNameIdx] = useState(0);
    const [log, setLog] = useState<LogLine[]>([
        { id: 0, text: "effect ran: count = 0" },
    ]);
    const [logId, setLogId] = useState(1);
    const [effectRuns, setEffectRuns] = useState(1);

    const bumpCount = useCallback(() => {
        setCount((c) => {
            const next = c + 1;
            setLog((l) =>
                [{ id: logId, text: `effect ran: count = ${next}` }, ...l].slice(
                    0,
                    6,
                ),
            );
            setLogId((i) => i + 1);
            setEffectRuns((r) => r + 1);
            return next;
        });
    }, [logId]);

    const cycleName = useCallback(() => {
        setNameIdx((i) => (i + 1) % NAMES.length);
    }, []);

    const reset = useCallback(() => {
        setCount(0);
        setNameIdx(0);
        setLog([{ id: 0, text: "effect ran: count = 0" }]);
        setLogId(1);
        setEffectRuns(1);
    }, []);

    return (
        <CacheDemo
            title="signal + effect"
            caption="effect reads count, not name. setting name does nothing."
            onReset={reset}
        >
            <div style={signalRow}>
                <div style={signalCard}>
                    <div style={signalLabel}>count</div>
                    <div style={signalValue}>{count}</div>
                    <button onClick={bumpCount} style={requestBtnStyleWide}>
                        count++
                    </button>
                </div>
                <div style={signalCard}>
                    <div style={signalLabel}>name</div>
                    <div style={signalValue}>{NAMES[nameIdx]}</div>
                    <button onClick={cycleName} style={requestBtnStyleWide}>
                        next name
                    </button>
                </div>
            </div>

            <p style={messageStyle}>
                effect runs:{" "}
                <strong style={{ color: "oklch(0.45 0.15 145)" }}>
                    {effectRuns}
                </strong>
            </p>

            <div style={logBox}>
                {log.map((line) => (
                    <div key={line.id} style={logLine}>
                        {line.text}
                    </div>
                ))}
            </div>
        </CacheDemo>
    );
}

const signalRow: CSSProperties = {
    display: "flex",
    gap: 12,
    marginBottom: 14,
    flexWrap: "wrap",
};

const signalCard: CSSProperties = {
    flex: "1 1 140px",
    padding: 12,
    borderRadius: 6,
    background: "oklch(0.975 0.006 80)",
    border: "1px solid oklch(0.85 0.008 80)",
};

const signalLabel: CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontSize: 11,
    color: "oklch(0.5 0.01 80)",
    marginBottom: 4,
};

const signalValue: CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontSize: 22,
    fontWeight: 600,
    marginBottom: 10,
    color: "oklch(0.22 0.008 80)",
};

const requestBtnStyleWide: CSSProperties = {
    ...requestBtnStyle,
    width: "100%",
    height: 32,
};

const logBox: CSSProperties = {
    background: "oklch(0.99 0.003 80)",
    border: "1px solid oklch(0.88 0.008 80)",
    borderRadius: 4,
    padding: 10,
    minHeight: 100,
};

const logLine: CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontSize: 12,
    color: "oklch(0.35 0.01 80)",
    fontVariantLigatures: "none",
    padding: "2px 0",
};
