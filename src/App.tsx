import { useState, useRef, useMemo, useCallback } from "react";

type Stage = "initial" | "sorry" | "think" | "final_chance" | "running" | "love";

interface BgHeart {
    id: number;
    left: number;
    size: number;
    delay: number;
    duration: number;
    hue: number;
}

interface ClickHeart {
    id: number;
    x: number;
    y: number;
}

const STAGES: Record<Stage, {
    question: string;
    gif: string;
    yesLabel?: string;
    noLabel?: string;
}> = {
    initial: {
        question: "Suno naa!!",
        gif: "https://media.tenor.com/rOiSuwloJpsAAAAM/emrananhret.gif",
        yesLabel: "Bolo",
        noLabel: "No",
    },
    sorry: {
        question: "I'm SORRY",
        gif: "https://media.tenor.com/d2bfKgblQcsAAAAj/dudu-sorry-bubu-dudu-for-give.gif",
        yesLabel: "Accha thik hai",
        noLabel: "No",
    },
    think: {
        question: "Soch lo acche se!",
        gif: "https://media.tenor.com/wDR4aS0xUmkAAAAM/dudu-bubu.gif",
        yesLabel: "Accha thik hai",
        noLabel: "Nahi Sochna",
    },
    final_chance: {
        question: "Ak baar ar soch lo",
        gif: "https://media.tenor.com/tneQa93qByQAAAAM/hay-nako-reika-teary-dudu.gif",
        yesLabel: "Chalo maan gai",
        noLabel: "Final no",
    },
    running: {
        question: "Manja nah! kitna bhav khayegi",
        gif: "https://media.tenor.com/ZC9BMMdxMMUAAAAM/bubu-bubu-dudu.gif",
        yesLabel: "Yes",
        noLabel: "No",
    },
    love: {
        question: "Hehehe!! I knew It ♥",
        gif: "https://media.tenor.com/kOfhJ6VeBIsAAAAM/dudu-bubu.gif",
    },
};

function useBgHearts(): BgHeart[] {
    return useMemo(() => Array.from({ length: 22 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 12 + Math.random() * 22,
        delay: Math.random() * 10,
        duration: 7 + Math.random() * 8,
        hue: 330 + Math.random() * 40,
    })), []);
}

export default function App() {
    const [stage, setStage] = useState<Stage>("initial");
    const [clickHearts, setClickHearts] = useState<ClickHeart[]>([]);
    const noRef = useRef<HTMLButtonElement>(null);
    const bgHearts = useBgHearts();
    const clickIdRef = useRef(0);

    const current = STAGES[stage];

    const spawnClickHeart = useCallback((e: React.MouseEvent) => {
        const id = ++clickIdRef.current;
        setClickHearts(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
        setTimeout(() => setClickHearts(prev => prev.filter(h => h.id !== id)), 1400);
    }, []);

    function handleYes() {
        if (stage === "initial") setStage("sorry");
        else if (stage === "sorry") setStage("love");
        else if (stage === "think") setStage("love");
        else if (stage === "final_chance") setStage("love");
        else if (stage === "running") setStage("love");
    }

    function handleNo() {
        if (stage === "initial") setStage("sorry");
        else if (stage === "sorry") setStage("think");
        else if (stage === "think") setStage("final_chance");
        else if (stage === "final_chance") setStage("running");
        else if (stage === "running") setStage("love");
    }

    function moveNoButton() {
        const btn = noRef.current;
        if (!btn) return;
        const margin = 16;
        const maxX = window.innerWidth * 0.7 - btn.offsetWidth;
        const maxY = window.innerHeight * 0.7 - btn.offsetHeight;
        const rx = margin + Math.floor(Math.random() * Math.max(0, maxX - margin));
        const ry = margin + Math.floor(Math.random() * Math.max(0, maxY - margin));
        btn.style.position = "fixed";
        btn.style.left = rx + "px";
        btn.style.top = ry + "px";
        btn.style.zIndex = "50";
    }

    return (
        <div
            className="relative min-h-screen w-full flex items-center justify-center overflow-hidden cursor-pointer select-none"
            style={{ background: "linear-gradient(135deg, #ffe0eb 0%, #fff0f5 50%, #ffd6e7 100%)" }}
            onClick={spawnClickHeart}
        >
            {/* Floating background hearts */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden>
                {bgHearts.map(h => (
                    <span
                        key={h.id}
                        className="absolute bottom-0 animate-rise-heart"
                        style={{
                            left: `${h.left}%`,
                            fontSize: `${h.size}px`,
                            animationDelay: `${h.delay}s`,
                            animationDuration: `${h.duration}s`,
                            color: `hsl(${h.hue}deg 80% 65%)`,
                        }}
                    >
                        ♥
                    </span>
                ))}
            </div>

            {/* Click-spawn hearts */}
            {clickHearts.map(h => (
                <span
                    key={h.id}
                    className="fixed pointer-events-none animate-click-heart text-2xl"
                    style={{
                        left: h.x,
                        top: h.y,
                        color: `hsl(${340 + Math.random() * 30}deg 80% 60%)`,
                        zIndex: 100,
                    }}
                >
                    ♥
                </span>
            ))}

            {/* Card */}
            <div
                className="relative z-10 flex flex-col items-center gap-5 px-8 py-10 rounded-3xl"
                style={{
                    background: "rgba(255,255,255,0.55)",
                    backdropFilter: "blur(14px)",
                    boxShadow: "0 8px 40px rgba(255,100,150,0.2), 0 2px 12px rgba(255,100,150,0.1)",
                    border: "1.5px solid rgba(255,180,210,0.5)",
                    maxWidth: 420,
                    width: "90vw",
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Question */}
                <h2
                    className="text-3xl font-bold text-center"
                    style={{
                        fontFamily: "'Poppins', sans-serif",
                        color: "#d63384",
                        textShadow: "0 1px 8px rgba(255,100,150,0.25)",
                    }}
                >
                    {current.question}
                </h2>

                {/* GIF */}
                <div className="relative">
                    <img
                        src={current.gif}
                        alt="dudu bubu reaction"
                        className="rounded-2xl shadow-lg object-contain transition-all duration-500"
                        style={{ width: 260, height: 220, objectFit: "contain" }}
                    />
                </div>

                {/* Buttons */}
                {stage !== "love" && (
                    <div className="flex gap-8 mt-2">
                        <button
                            onClick={handleYes}
                            className="w-36 h-11 rounded-full font-semibold text-base border-2 transition-all duration-200 cursor-pointer active:scale-95"
                            style={{
                                fontFamily: "'Poppins', sans-serif",
                                background: "linear-gradient(135deg, #ff6b9d, #ff4081)",
                                color: "#fff",
                                border: "2px solid #d63384",
                                boxShadow: "0 4px 14px rgba(255,64,129,0.35)",
                            }}
                        >
                            {current.yesLabel}
                        </button>

                        <button
                            ref={noRef}
                            onClick={stage === "running" ? (e) => e.preventDefault() : handleNo}
                            onMouseEnter={stage === "running" ? moveNoButton : undefined}
                            onTouchStart={stage === "running" ? (e) => { e.preventDefault(); moveNoButton(); } : undefined}
                            className="w-36 h-11 rounded-full font-semibold text-base border-2 transition-all duration-200 cursor-pointer active:scale-95"
                            style={{
                                fontFamily: "'Poppins', sans-serif",
                                background: "#fff",
                                color: "#d63384",
                                border: "2px solid #ffb3c1",
                                boxShadow: "0 4px 14px rgba(255,100,150,0.15)",
                                touchAction: "none",
                            }}
                        >
                            {current.noLabel}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
