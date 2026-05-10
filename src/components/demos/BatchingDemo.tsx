import { useState, useCallback, type CSSProperties } from "react";
import { CacheDemo, requestBtnStyle, messageStyle } from "./CacheDemo";

interface LogLine {
    id: number;
    text: string;
}

export function BatchingDemo() {
    const [first, setFirst] = useState("Ada");
    const [last, setLast] = useState("Lovelace");
    const [batched, setBatched] = useState(true);
    const [runs, setRuns] = useState(1);
    const [log, setLog] = useState<LogLine[]>([
        { id: 0, text: "effect ran: Ada Lovelace" },
    ]);
    const [logId, setLogId] = useState(1);

    const updateBoth = useCallback(() => {
        const nextFirst = first === "Ada" ? "Grace" : "Ada";
        const nextLast = last === "Lovelace" ? "Hopper" : "Lovelace";

        setFirst(nextFirst);
        setLast(nextLast);

        if (batched) {
            setRuns((r) => r + 1);
            setLog((l) =>
                [
                    {
                        id: logId,
                        text: `effect ran: ${nextFirst} ${nextLast}`,
                    },
                    ...l,
                ].slice(0, 6),
            );
            setLogId((i) => i + 1);
        } else {
            setRuns((r) => r + 2);
            setLog((l) =>
                [
                    {
                        id: logId + 1,
                        text: `effect ran: ${nextFirst} ${nextLast}`,
                    },
                    {
                        id: logId,
                        text: `effect ran: ${nextFirst} ${last}`,
                    },
                    ...l,
                ].slice(0, 6),
            );
            setLogId((i) => i + 2);
        }
    }, [first, last, batched, logId]);

    const reset = useCallback(() => {
        setFirst("Ada");
        setLast("Lovelace");
        setRuns(1);
        setLog([{ id: 0, text: "effect ran: Ada Lovelace" }]);
        setLogId(1);
    }, []);

    return (
        <CacheDemo
            title="batching"
            caption="effect depends on first and last. update both at once."
            onReset={reset}
        >
            <div style={toggleRow}>
                <button
                    onClick={() => setBatched(false)}
                    style={{
                        ...toggleBtn,
                        ...(batched ? {} : toggleBtnActive),
                    }}
                >
                    no batch
                </button>
                <button
                    onClick={() => setBatched(true)}
                    style={{
                        ...toggleBtn,
                        ...(batched ? toggleBtnActive : {}),
                    }}
                >
                    batch
                </button>
            </div>

            <div style={signalRow}>
                <div style={signalCard}>
                    <div style={signalLabel}>first</div>
                    <div style={signalValue}>{first}</div>
                </div>
                <div style={signalCard}>
                    <div style={signalLabel}>last</div>
                    <div style={signalValue}>{last}</div>
                </div>
            </div>

            <button onClick={updateBoth} style={updateBtn}>
                set both signals
            </button>

            <p style={messageStyle}>
                effect runs:{" "}
                <strong
                    style={{
                        color: batched
                            ? "oklch(0.45 0.15 145)"
                            : "oklch(0.55 0.15 30)",
                    }}
                >
                    {runs}
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

const toggleRow: CSSProperties = {
    display: "flex",
    gap: 6,
    marginBottom: 14,
};

const toggleBtn: CSSProperties = {
    ...requestBtnStyle,
    width: "auto",
    height: 30,
    padding: "0 14px",
    flex: 1,
};

const toggleBtnActive: CSSProperties = {
    background: "oklch(0.35 0.008 80)",
    color: "oklch(0.97 0.005 80)",
    borderColor: "oklch(0.3 0.008 80)",
};

const signalRow: CSSProperties = {
    display: "flex",
    gap: 12,
    marginBottom: 12,
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
    fontSize: 18,
    fontWeight: 600,
    color: "oklch(0.22 0.008 80)",
};

const updateBtn: CSSProperties = {
    ...requestBtnStyle,
    width: "100%",
    height: 36,
    marginBottom: 4,
};

const logBox: CSSProperties = {
    background: "oklch(0.99 0.003 80)",
    border: "1px solid oklch(0.88 0.008 80)",
    borderRadius: 4,
    padding: 10,
    minHeight: 100,
    marginTop: 8,
};

const logLine: CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontSize: 12,
    color: "oklch(0.35 0.01 80)",
    fontVariantLigatures: "none",
    padding: "2px 0",
};
