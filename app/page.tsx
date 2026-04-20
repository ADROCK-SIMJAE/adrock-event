"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

type GameState =
  | "idle"
  | "running"
  | "won"
  | "lost"
  | "phone"
  | "sent";

const WIN_MIN = 3.1;
const WIN_MAX = 3.3;
const STORAGE_KEY = "sesa-coupons";

const formatPhone = (raw: string) => {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  if (digits.length < 4) return digits;
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
};

const isValidPhone = (raw: string) => {
  const digits = raw.replace(/\D/g, "");
  return digits.length === 11 && digits.startsWith("010");
};

export default function Home() {
  const [state, setState] = useState<GameState>("idle");
  const [time, setTime] = useState(0);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const rafRef = useRef<number | null>(null);
  const startAtRef = useRef<number>(0);

  const startGame = () => {
    setState("running");
    setTime(0);
    startAtRef.current = performance.now();
    const tick = () => {
      const elapsed = (performance.now() - startAtRef.current) / 1000;
      setTime(elapsed);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const stopGame = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    const finalTime = (performance.now() - startAtRef.current) / 1000;
    setTime(finalTime);
    const won = finalTime >= WIN_MIN && finalTime <= WIN_MAX;
    setState(won ? "won" : "lost");
  };

  const reset = () => {
    setState("idle");
    setTime(0);
    setPhone("");
    setPhoneError("");
  };

  const goToPhoneInput = () => {
    setPhoneError("");
    setState("phone");
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
    if (phoneError) setPhoneError("");
  };

  const handleSubmitPhone = (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!isValidPhone(phone)) {
      setPhoneError("010으로 시작하는 11자리 번호를 입력해주세요");
      return;
    }
    try {
      const entries = JSON.parse(
        window.localStorage.getItem(STORAGE_KEY) ?? "[]",
      );
      entries.push({
        phone,
        time: displayTime,
        at: new Date().toISOString(),
      });
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      // ignore storage errors
    }
    setState("sent");
  };

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const displayTime = time.toFixed(2).padStart(5, "0");

  const primaryMessage: Record<GameState, string> = {
    idle: "정확히 맞추면 쿠폰 당첨!",
    running: "지금! STOP 을 눌러요",
    won: `${displayTime}초 딱 맞췄어요!`,
    lost: "범위를 놓쳤어요. 다시!",
    phone: "쿠폰 받으실 번호를 입력해주세요",
    sent: "쿠폰을 발송했어요!",
  };

  const showHint =
    state === "idle" || state === "running" || state === "lost";
  const showBanner =
    state === "won" || state === "lost" || state === "sent";

  return (
    <main className="relative min-h-[100dvh] overflow-hidden">
      <BackgroundVideo state={state} />

      <CharacterOverlay />

      <section className="flex flex-col items-center gap-2.5 px-4 pt-[6dvh]">
        <TimerDisplay value={displayTime} pulsing={state === "running"} />
        {showHint && <HintPill />}
        {showBanner && (
          <div className="mt-1">
            {state === "won" && (
              <Banner tone="win">
                <Star className="-top-2.5 -left-4" />
                <Star className="-top-1 -right-4" />
                당첨!
              </Banner>
            )}
            {state === "lost" && <Banner tone="lose">아쉬워요!</Banner>}
            {state === "sent" && (
              <Banner tone="sent">
                <Star className="-top-2.5 -left-4" />
                <Star className="-top-1 -right-4" />
                발송 완료!
              </Banner>
            )}
          </div>
        )}
      </section>

      <footer className="safe-pb fixed inset-x-0 bottom-0 z-20 px-4 pb-3 pt-6">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-full bg-gradient-to-t from-white/30 via-white/8 to-transparent"
        />
        <div className="mx-auto flex w-full max-w-[340px] flex-col items-center gap-2.5">
          <Pill>
            {state === "sent" ? (
              <>
                <strong className="mr-1 text-[#2a1f6b]">{phone}</strong>으로
                보냈어요
              </>
            ) : (
              primaryMessage[state]
            )}
          </Pill>

          <Coupon />

          {state === "phone" && (
            <form
              onSubmit={handleSubmitPhone}
              className="flex w-full flex-col items-center gap-2"
            >
              <label className="sr-only" htmlFor="phone">
                휴대폰 번호
              </label>
              <input
                id="phone"
                type="tel"
                inputMode="numeric"
                placeholder="010-0000-0000"
                value={phone}
                onChange={handlePhoneChange}
                autoComplete="tel"
                className="h-[52px] w-full rounded-full bg-white px-5 text-center text-[1.1rem] font-black tracking-wider text-[#2a1f6b] outline-none placeholder:font-bold placeholder:text-[#b4b8d9] shadow-[inset_0_2px_0_rgba(255,255,255,0.9),inset_0_-3px_6px_rgba(40,50,130,0.08),0_5px_0_#c9ceec,0_10px_18px_rgba(60,70,140,0.22)] focus:shadow-[inset_0_2px_0_rgba(255,255,255,0.9),inset_0_-3px_6px_rgba(40,50,130,0.1),0_5px_0_#9ba3dc,0_10px_18px_rgba(80,100,180,0.28)]"
              />
              {phoneError && (
                <p className="rounded-full bg-[#ffe5de] px-3 py-1 text-[0.78rem] font-bold text-[#c64a28] shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_2px_6px_rgba(180,60,40,0.2)]">
                  {phoneError}
                </p>
              )}
              <button type="submit" className="sr-only" aria-hidden>
                submit
              </button>
            </form>
          )}

          {state === "phone" && (
            <button
              type="button"
              onClick={() => setState("won")}
              className="rounded-full bg-white/75 px-3 py-1 text-[0.78rem] font-bold text-[#4a3f8a] backdrop-blur-sm hover:underline"
            >
              이전으로
            </button>
          )}

          {state === "idle" && (
            <PuffButton variant="start" onClick={startGame}>
              START
            </PuffButton>
          )}
          {state === "running" && (
            <PuffButton variant="stop" onClick={stopGame}>
              STOP!
            </PuffButton>
          )}
          {state === "lost" && (
            <PuffButton variant="retry" onClick={reset}>
              다시 도전
            </PuffButton>
          )}
          {state === "won" && (
            <PuffButton variant="claim" onClick={goToPhoneInput}>
              쿠폰 발급받기
            </PuffButton>
          )}
          {state === "phone" && (
            <PuffButton
              variant="claim"
              onClick={() => handleSubmitPhone()}
            >
              쿠폰 발급받기
            </PuffButton>
          )}
          {state === "sent" && (
            <PuffButton variant="start" onClick={reset}>
              처음으로
            </PuffButton>
          )}
        </div>
      </footer>
    </main>
  );
}

const VIDEO_BY_STATE: Partial<Record<GameState, string>> = {
  running: "/running.mp4",
};

function BackgroundVideo({ state }: { state: GameState }) {
  const src = VIDEO_BY_STATE[state] ?? "/intro.mp4";
  return (
    <video
      key={src}
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full object-cover"
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      poster="/bg.png"
      aria-hidden
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}

function CharacterOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed bottom-[20dvh] left-1/2 z-10 h-[34dvh] -translate-x-1/2 animate-float"
      style={{
        aspectRatio: "1 / 1",
        background:
          "radial-gradient(closest-side, rgba(255,250,230,0.95) 0%, rgba(255,250,230,0.55) 45%, rgba(255,250,230,0) 72%)",
      }}
    >
      <video
        className="h-full w-full object-contain [filter:drop-shadow(0_0_1px_rgba(15,20,45,1))_drop-shadow(0_10px_18px_rgba(15,20,45,0.6))]"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/character.webm" type="video/webm" />
        <source src="/character.mov" type='video/mp4; codecs="hvc1"' />
      </video>
    </div>
  );
}

function TimerDisplay({
  value,
  pulsing,
}: {
  value: string;
  pulsing: boolean;
}) {
  return (
    <div
      className={`relative flex h-[76px] w-[300px] items-center justify-center rounded-full text-[2.15rem] font-black tracking-wider text-white tabular-nums [font-feature-settings:'tnum'] [text-shadow:0_2px_0_rgba(0,0,0,0.25)] bg-gradient-to-b from-[#5a5fbf] via-[#3b3f8d] to-[#1f2252] shadow-[inset_0_3px_0_rgba(255,255,255,0.45),inset_0_-5px_10px_rgba(10,15,50,0.45),0_6px_0_#171a45,0_14px_22px_rgba(30,35,95,0.4)] ${
        pulsing ? "animate-pulse-fast" : ""
      }`}
    >
      <DecoBubble className="-left-2 top-2 h-3 w-3" />
      <DecoBubble className="-right-3 bottom-1 h-4 w-4" />
      <DecoBubble className="left-4 -top-2 h-2 w-2" />
      {value}초
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-white/85 px-4 py-1.5 text-[0.9rem] font-bold text-[#4a3f8a] shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_3px_8px_rgba(80,70,140,0.22)] backdrop-blur-sm">
      {children}
    </span>
  );
}

function HintPill() {
  return (
    <div className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-white/88 px-3.5 py-1.5 text-[0.78rem] font-bold text-[#4a3f8a] shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_3px_8px_rgba(80,70,140,0.22)] backdrop-blur-sm">
      💡 <strong className="text-[#d17b00]">3.10 ~ 3.30초</strong> 사이에서
      멈추면 당첨 확률 UP!
    </div>
  );
}

function Banner({
  tone,
  children,
}: {
  tone: "win" | "lose" | "sent";
  children: React.ReactNode;
}) {
  if (tone === "win") {
    return (
      <h2 className="relative text-[2.2rem] font-black italic -tracking-[0.02em] text-[#ff4d6b] animate-pop [paint-order:stroke_fill] [-webkit-text-stroke:5px_#ffffff] [text-shadow:0_4px_0_#f4c41a,0_8px_14px_rgba(180,40,70,0.35)]">
        {children}
      </h2>
    );
  }
  if (tone === "sent") {
    return (
      <h2 className="relative text-[1.95rem] font-black italic -tracking-[0.02em] text-[#2aa77a] animate-pop [paint-order:stroke_fill] [-webkit-text-stroke:4px_#ffffff] [text-shadow:0_4px_0_#f4c41a,0_6px_12px_rgba(30,120,85,0.3)]">
        {children}
      </h2>
    );
  }
  return (
    <p className="text-[1.6rem] font-black italic -tracking-[0.02em] text-[#6c5dc7] animate-pop [paint-order:stroke_fill] [-webkit-text-stroke:4px_#ffffff] [text-shadow:0_3px_0_rgba(255,200,210,0.85),0_6px_10px_rgba(100,80,180,0.28)]">
      {children}
    </p>
  );
}

function Star({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`absolute h-[16px] w-[16px] animate-twinkle bg-[#ffd24a] [clip-path:polygon(50%_0%,61%_35%,98%_35%,68%_57%,79%_91%,50%_70%,21%_91%,32%_57%,2%_35%,39%_35%)] ${className}`}
    />
  );
}

function DecoBubble({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute rounded-full bg-white/85 shadow-[inset_-1.5px_-1.5px_0_rgba(150,180,220,0.4)] ${className}`}
    />
  );
}

function Coupon() {
  return (
    <div className="relative flex h-[82px] w-full max-w-[280px] items-center justify-center gap-2.5 rounded-[28px] px-4 py-2 bg-gradient-to-b from-[#fff6b3] via-[#ffdf4c] to-[#ffb400] shadow-[inset_0_3px_0_rgba(255,255,255,0.85),inset_0_-6px_10px_rgba(170,110,0,0.35),0_6px_0_#c58a00,0_14px_22px_rgba(160,100,0,0.3)]">
      <DecoBubble className="-left-2 top-3 h-3 w-3" />
      <DecoBubble className="-right-2 bottom-2 h-4 w-4" />
      <DecoBubble className="right-6 -top-2 h-2 w-2" />

      <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-white/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-2px_4px_rgba(170,110,0,0.2)]">
        <svg
          className="h-10 w-10"
          viewBox="0 0 44 44"
          aria-hidden
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="4"
            y="10"
            width="36"
            height="24"
            rx="5"
            fill="#fffadf"
            stroke="#a23e00"
            strokeWidth="2.5"
          />
          <path
            d="M10 14 L34 14"
            stroke="#a23e00"
            strokeWidth="1.5"
            strokeDasharray="2 2"
          />
          <text
            x="22"
            y="29"
            textAnchor="middle"
            fontSize="13"
            fontWeight="900"
            fill="#a23e00"
          >
            ₩
          </text>
        </svg>
      </div>
      <div className="flex flex-col items-start leading-[1.05]">
        <span className="text-[1.75rem] font-black -tracking-[0.02em] text-[#a23e00] [text-shadow:0_2px_0_#fff2a8,0_3px_0_rgba(255,255,255,0.9)]">
          ₩1,000
        </span>
        <span className="text-[0.98rem] font-extrabold text-[#a23e00] [text-shadow:0_1px_0_#fff2a8]">
          세차 할인
        </span>
      </div>
    </div>
  );
}

const BUTTON_VARIANTS = {
  start:
    "bg-gradient-to-b from-[#dac9f7] via-[#a58fe2] to-[#5f4bb3] [text-shadow:0_2px_0_rgba(50,30,110,0.5)] shadow-[inset_0_3px_0_rgba(255,255,255,0.7),inset_0_-5px_10px_rgba(40,25,90,0.3),0_6px_0_#3f2d8c,0_14px_22px_rgba(75,55,140,0.35)]",
  stop: "bg-gradient-to-b from-[#ff9a7a] via-[#ff5a4b] to-[#d83230] [text-shadow:0_2px_0_rgba(120,20,20,0.5)] shadow-[inset_0_3px_0_rgba(255,255,255,0.7),inset_0_-5px_10px_rgba(140,25,25,0.35),0_6px_0_#a81e1e,0_14px_22px_rgba(190,45,45,0.4)] animate-urgent-pulse",
  claim:
    "bg-gradient-to-b from-[#c5e4ff] via-[#72b3ee] to-[#2d7bc4] [text-shadow:0_2px_0_rgba(20,50,110,0.5)] shadow-[inset_0_3px_0_rgba(255,255,255,0.75),inset_0_-5px_10px_rgba(20,50,110,0.3),0_6px_0_#1c5a99,0_14px_22px_rgba(35,95,170,0.35)]",
  retry:
    "bg-gradient-to-b from-[#ffd0cc] via-[#ff9395] to-[#e15565] [text-shadow:0_2px_0_rgba(130,30,45,0.5)] shadow-[inset_0_3px_0_rgba(255,255,255,0.75),inset_0_-5px_10px_rgba(130,30,45,0.3),0_6px_0_#b03345,0_14px_22px_rgba(170,55,75,0.35)]",
} as const;

function PuffButton({
  variant,
  onClick,
  children,
}: {
  variant: keyof typeof BUTTON_VARIANTS;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative h-[58px] w-full rounded-[28px] text-[1.2rem] font-black tracking-wider text-white transition-transform duration-75 active:translate-y-[4px] active:shadow-none ${BUTTON_VARIANTS[variant]}`}
    >
      <DecoBubble className="-left-2 top-3 h-3 w-3" />
      <DecoBubble className="-right-3 bottom-2 h-4 w-4" />
      <DecoBubble className="right-8 -top-2 h-2 w-2" />
      <span className="relative z-10">{children}</span>
    </button>
  );
}
