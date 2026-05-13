import {
    useEffect,
    useMemo,
    useRef,
    useState,
    type CSSProperties,
} from "react";
import { useReducedMotion } from "./useReducedMotion";

const mono: CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontVariantLigatures: "none",
};

const shellStyle: CSSProperties = {
    border: "1px solid oklch(0.85 0.008 80)",
    borderRadius: 6,
    padding: 16,
    margin: "1.6em 0",
    background: "oklch(0.96 0.005 80)",
    overflow: "hidden",
};

const buttonStyle: CSSProperties = {
    ...mono,
    border: "1px solid oklch(0.78 0.01 80)",
    background: "oklch(0.98 0.004 80)",
    color: "oklch(0.25 0.01 80)",
    borderRadius: 4,
    padding: "7px 10px",
    fontSize: 12,
    cursor: "pointer",
};

const activeButtonStyle: CSSProperties = {
    ...buttonStyle,
    borderColor: "oklch(0.55 0.12 170)",
    background: "oklch(0.92 0.04 170)",
    color: "oklch(0.32 0.12 170)",
};

interface Step {
    label: string;
    value: string;
    kind: "plain" | "box" | "fail";
}

const HERO_STEPS: Step[] = [
    { label: "read", value: '"42"', kind: "plain" },
    { label: "wrap", value: "Maybe(42)", kind: "box" },
    { label: "map", value: "Maybe(84)", kind: "box" },
    { label: "bind", value: "Maybe(85)", kind: "box" },
    { label: "unwrap", value: "85", kind: "plain" },
];

export function MonadHero() {
    const [index, setIndex] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const reduced = useReducedMotion();

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setIndex((i) => (i + 1) % HERO_STEPS.length);
        }, reduced ? 1600 : 1150);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [reduced]);

    return (
        <div style={shellStyle} data-demo>
            <div style={heroTrackStyle}>
                {HERO_STEPS.map((step, stepIndex) => {
                    const active = stepIndex === index;
                    return (
                        <div
                            key={step.label}
                            style={{
                                ...heroNodeStyle,
                                borderColor: active
                                    ? "oklch(0.55 0.13 170)"
                                    : "oklch(0.84 0.008 80)",
                                background: active
                                    ? "oklch(0.94 0.04 170)"
                                    : "oklch(0.985 0.003 80)",
                                transform:
                                    active && !reduced
                                        ? "translateY(-4px)"
                                        : "translateY(0)",
                            }}
                        >
                            <div style={heroLabelStyle}>{step.label}</div>
                            <div
                                key={`${step.value}-${index}`}
                                style={{
                                    ...heroValueStyle,
                                    animation:
                                        active && !reduced
                                            ? "monad-pop 520ms ease-out"
                                            : "none",
                                    color:
                                        step.kind === "fail"
                                            ? "oklch(0.48 0.14 30)"
                                            : step.kind === "box"
                                              ? "oklch(0.33 0.12 170)"
                                              : "oklch(0.24 0.01 80)",
                                }}
                            >
                                {step.value}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div style={railStyle}>
                <div
                    style={{
                        ...railDotStyle,
                        left: `${(index / (HERO_STEPS.length - 1)) * 100}%`,
                        transition: reduced ? "none" : "left 520ms ease",
                    }}
                />
            </div>
            <p style={captionStyle}>
                a monad is a rule for moving plain functions through a boxed
                value without breaking the box.
            </p>
            <style>{`
                @keyframes monad-pop {
                    0% { transform: scale(0.96); opacity: 0.45; }
                    60% { transform: scale(1.04); opacity: 1; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
}

type RawInput = "42" | "0" | "hello" | "";

const INPUTS: RawInput[] = ["42", "0", "hello", ""];

function parseNumber(input: string): number | null {
    const parsed = Number(input);
    return Number.isFinite(parsed) && input.trim() !== "" ? parsed : null;
}

function reciprocal(n: number): number | null {
    return n === 0 ? null : 1 / n;
}

function asPercent(n: number): string {
    return `${(n * 100).toFixed(2)}%`;
}

export function MaybePipelineDemo() {
    const [input, setInput] = useState<RawInput>("42");

    const steps = useMemo(() => {
        const parsed = parseNumber(input);
        const rec = parsed === null ? null : reciprocal(parsed);
        const percent = rec === null ? null : asPercent(rec);

        return [
            {
                label: "fromNullable(input)",
                value: input === "" ? "Nothing" : `Just("${input}")`,
                bad: input === "",
            },
            {
                label: "chain(parseNumber)",
                value: parsed === null ? "Nothing" : `Just(${parsed})`,
                bad: parsed === null,
            },
            {
                label: "chain(reciprocal)",
                value: rec === null ? "Nothing" : `Just(${round(rec)})`,
                bad: rec === null,
            },
            {
                label: "map(asPercent)",
                value: percent === null ? "Nothing" : `Just("${percent}")`,
                bad: percent === null,
            },
        ];
    }, [input]);

    return (
        <div style={shellStyle} data-demo>
            <div style={demoHeaderStyle}>
                <div>
                    <div style={demoTitleStyle}>Maybe pipeline</div>
                    <div style={captionStyle}>
                        invalid input turns into Nothing once, then every later
                        step politely skips.
                    </div>
                </div>
                <div style={buttonRowStyle}>
                    {INPUTS.map((value) => (
                        <button
                            key={value || "empty"}
                            type="button"
                            onClick={() => setInput(value)}
                            style={
                                input === value ? activeButtonStyle : buttonStyle
                            }
                        >
                            {value === "" ? "empty" : value}
                        </button>
                    ))}
                </div>
            </div>

            <div style={pipelineStyle}>
                {steps.map((step, i) => (
                    <div
                        key={step.label}
                        style={{
                            ...pipelineCardStyle,
                            borderColor: step.bad
                                ? "oklch(0.72 0.08 35)"
                                : "oklch(0.82 0.03 170)",
                            background: step.bad
                                ? "oklch(0.96 0.025 35)"
                                : "oklch(0.975 0.012 170)",
                        }}
                    >
                        <div style={stepIndexStyle}>{i + 1}</div>
                        <div style={stepLabelStyle}>{step.label}</div>
                        <div
                            key={`${input}-${step.value}`}
                            style={{
                                ...stepValueStyle,
                                color: step.bad
                                    ? "oklch(0.45 0.13 35)"
                                    : "oklch(0.31 0.11 170)",
                                animation: "monad-fade 260ms ease-out",
                            }}
                        >
                            {step.value}
                        </div>
                    </div>
                ))}
            </div>
            <style>{`
                @keyframes monad-fade {
                    from { opacity: 0.35; transform: translateY(3px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}

const BIND_STEPS = [
    {
        label: "start",
        expression: "Just(2)",
        note: "a number in a box",
    },
    {
        label: "map(addOne)",
        expression: "Just(3)",
        note: "plain function, same box",
    },
    {
        label: "map(safeHalf)",
        expression: "Just(Just(1.5))",
        note: "boxed function result, nested box",
    },
    {
        label: "chain(safeHalf)",
        expression: "Just(1.5)",
        note: "bind maps, then flattens once",
    },
];

export function BindFlattenDemo() {
    const [step, setStep] = useState(0);

    return (
        <div style={shellStyle} data-demo>
            <div style={demoHeaderStyle}>
                <div>
                    <div style={demoTitleStyle}>map vs chain</div>
                    <div style={captionStyle}>
                        chain is what stops your boxes from nesting forever.
                    </div>
                </div>
                <div style={buttonRowStyle}>
                    <button
                        type="button"
                        onClick={() =>
                            setStep((value) =>
                                Math.min(value + 1, BIND_STEPS.length - 1),
                            )
                        }
                        style={buttonStyle}
                    >
                        next
                    </button>
                    <button
                        type="button"
                        onClick={() => setStep(0)}
                        style={buttonStyle}
                    >
                        reset
                    </button>
                </div>
            </div>

            <div style={bindStageStyle}>
                {BIND_STEPS.map((item, index) => {
                    const visible = index <= step;
                    const active = index === step;
                    return (
                        <div
                            key={item.label}
                            style={{
                                ...bindCardStyle,
                                opacity: visible ? 1 : 0.25,
                                transform: active
                                    ? "translateY(-3px)"
                                    : "translateY(0)",
                                borderColor: active
                                    ? "oklch(0.58 0.12 260)"
                                    : "oklch(0.86 0.008 80)",
                                background: active
                                    ? "oklch(0.95 0.035 260)"
                                    : "oklch(0.985 0.003 80)",
                            }}
                        >
                            <div style={stepLabelStyle}>{item.label}</div>
                            <div style={bindExpressionStyle}>
                                {item.expression}
                            </div>
                            <div style={bindNoteStyle}>{item.note}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function round(value: number): string {
    return Number.isInteger(value) ? String(value) : value.toFixed(4);
}

const heroTrackStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(92px, 1fr))",
    gap: 10,
};

const heroNodeStyle: CSSProperties = {
    border: "1px solid",
    borderRadius: 6,
    padding: "11px 10px",
    minHeight: 70,
    transition:
        "transform 220ms ease, border-color 220ms ease, background 220ms ease",
};

const heroLabelStyle: CSSProperties = {
    ...mono,
    color: "oklch(0.48 0.01 80)",
    fontSize: 11,
    marginBottom: 8,
};

const heroValueStyle: CSSProperties = {
    ...mono,
    fontSize: 14,
    fontWeight: 700,
    overflowWrap: "anywhere",
};

const railStyle: CSSProperties = {
    position: "relative",
    height: 2,
    margin: "18px 10px 12px",
    background: "oklch(0.86 0.01 80)",
};

const railDotStyle: CSSProperties = {
    position: "absolute",
    top: -5,
    width: 12,
    height: 12,
    marginLeft: -6,
    borderRadius: "50%",
    background: "oklch(0.52 0.14 170)",
};

const captionStyle: CSSProperties = {
    ...mono,
    color: "oklch(0.48 0.01 80)",
    fontSize: 11,
    lineHeight: 1.55,
    margin: 0,
};

const demoHeaderStyle: CSSProperties = {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 14,
};

const demoTitleStyle: CSSProperties = {
    ...mono,
    color: "oklch(0.24 0.01 80)",
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 4,
};

const buttonRowStyle: CSSProperties = {
    display: "flex",
    gap: 6,
    flexWrap: "wrap",
};

const pipelineStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: 10,
};

const pipelineCardStyle: CSSProperties = {
    border: "1px solid",
    borderRadius: 6,
    padding: 12,
    minHeight: 104,
};

const stepIndexStyle: CSSProperties = {
    ...mono,
    color: "oklch(0.52 0.01 80)",
    fontSize: 10,
    marginBottom: 8,
};

const stepLabelStyle: CSSProperties = {
    ...mono,
    color: "oklch(0.45 0.01 80)",
    fontSize: 11,
    marginBottom: 7,
};

const stepValueStyle: CSSProperties = {
    ...mono,
    fontSize: 16,
    fontWeight: 700,
    overflowWrap: "anywhere",
};

const bindStageStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
    gap: 10,
};

const bindCardStyle: CSSProperties = {
    border: "1px solid",
    borderRadius: 6,
    padding: 12,
    minHeight: 120,
    transition:
        "opacity 180ms ease, transform 180ms ease, border-color 180ms ease, background 180ms ease",
};

const bindExpressionStyle: CSSProperties = {
    ...mono,
    color: "oklch(0.28 0.11 260)",
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 8,
    overflowWrap: "anywhere",
};

const bindNoteStyle: CSSProperties = {
    color: "oklch(0.42 0.01 80)",
    fontSize: 13,
    lineHeight: 1.45,
};
