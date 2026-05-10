import { useState, useCallback, useRef, type CSSProperties } from "react";
import { CacheDemo, requestBtnStyle, messageStyle } from "./CacheDemo";

export function ComputedDemo() {
    const [price, setPrice] = useState(10);
    const [qty, setQty] = useState(2);
    const [computedRuns, setComputedRuns] = useState(1);
    const lastInputs = useRef({ price: 10, qty: 2 });

    const recomputeIfChanged = useCallback(
        (nextPrice: number, nextQty: number) => {
            if (
                lastInputs.current.price !== nextPrice ||
                lastInputs.current.qty !== nextQty
            ) {
                lastInputs.current = { price: nextPrice, qty: nextQty };
                setComputedRuns((r) => r + 1);
            }
        },
        [],
    );

    const setPriceTo = useCallback(
        (v: number) => {
            setPrice(v);
            recomputeIfChanged(v, qty);
        },
        [qty, recomputeIfChanged],
    );

    const setQtyTo = useCallback(
        (v: number) => {
            setQty(v);
            recomputeIfChanged(price, v);
        },
        [price, recomputeIfChanged],
    );

    const reset = useCallback(() => {
        setPrice(10);
        setQty(2);
        setComputedRuns(1);
        lastInputs.current = { price: 10, qty: 2 };
    }, []);

    const total = price * qty;

    return (
        <CacheDemo
            title="computed (memoised derived signal)"
            caption="setting a signal to the same value does not re-run the computed."
            onReset={reset}
        >
            <div style={row}>
                <Stepper
                    label="price"
                    value={price}
                    onDec={() => setPriceTo(Math.max(1, price - 1))}
                    onInc={() => setPriceTo(price + 1)}
                    onSame={() => setPriceTo(price)}
                />
                <Stepper
                    label="qty"
                    value={qty}
                    onDec={() => setQtyTo(Math.max(1, qty - 1))}
                    onInc={() => setQtyTo(qty + 1)}
                    onSame={() => setQtyTo(qty)}
                />
            </div>

            <div style={totalCard}>
                <div style={totalLabel}>total = price × qty</div>
                <div style={totalValue}>{total}</div>
            </div>

            <p style={messageStyle}>
                computed evaluations:{" "}
                <strong style={{ color: "oklch(0.45 0.15 145)" }}>
                    {computedRuns}
                </strong>
            </p>
        </CacheDemo>
    );
}

function Stepper({
    label,
    value,
    onDec,
    onInc,
    onSame,
}: {
    label: string;
    value: number;
    onDec: () => void;
    onInc: () => void;
    onSame: () => void;
}) {
    return (
        <div style={card}>
            <div style={cardLabel}>{label}</div>
            <div style={cardValue}>{value}</div>
            <div style={btnRow}>
                <button onClick={onDec} style={smallBtn}>
                    -
                </button>
                <button onClick={onSame} style={smallBtnWide}>
                    set same
                </button>
                <button onClick={onInc} style={smallBtn}>
                    +
                </button>
            </div>
        </div>
    );
}

const row: CSSProperties = {
    display: "flex",
    gap: 12,
    marginBottom: 14,
    flexWrap: "wrap",
};

const card: CSSProperties = {
    flex: "1 1 160px",
    padding: 12,
    borderRadius: 6,
    background: "oklch(0.975 0.006 80)",
    border: "1px solid oklch(0.85 0.008 80)",
};

const cardLabel: CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontSize: 11,
    color: "oklch(0.5 0.01 80)",
    marginBottom: 4,
};

const cardValue: CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontSize: 22,
    fontWeight: 600,
    marginBottom: 10,
    color: "oklch(0.22 0.008 80)",
};

const btnRow: CSSProperties = {
    display: "flex",
    gap: 6,
};

const smallBtn: CSSProperties = {
    ...requestBtnStyle,
    width: 32,
    height: 28,
    fontSize: 13,
};

const smallBtnWide: CSSProperties = {
    ...requestBtnStyle,
    flex: 1,
    width: "auto",
    height: 28,
    fontSize: 11,
};

const totalCard: CSSProperties = {
    padding: 14,
    borderRadius: 6,
    background: "oklch(0.95 0.04 90)",
    border: "1px solid oklch(0.85 0.04 90)",
    marginBottom: 12,
};

const totalLabel: CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontSize: 11,
    color: "oklch(0.4 0.08 90)",
    marginBottom: 4,
};

const totalValue: CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontSize: 26,
    fontWeight: 600,
    color: "oklch(0.35 0.12 90)",
};
