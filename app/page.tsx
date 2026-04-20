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
  const [showIntro, setShowIntro] = useState(true);
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
    lost: "아쉽게 범위를 놓쳤어요",
    phone: "쿠폰 받으실 번호를 입력해주세요",
    sent: "쿠폰을 발송했어요!",
  };

  const showHint =
    state === "idle" || state === "running" || state === "lost";

  const isModal =
    state === "won" || state === "phone" || state === "sent" || showIntro;

  return (
    <main className="relative min-h-[100dvh] overflow-hidden">
      <BackgroundVideo state={state} />

      {state === "lost" && (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-30 animate-red-flash bg-gradient-to-b from-red-500/60 via-red-500/20 to-transparent"
        />
      )}

      <section
        className={`flex flex-col items-center gap-4 px-4 pt-[6dvh] ${state === "lost" ? "animate-shake" : ""}`}
      >
        <TimerDisplay value={displayTime} pulsing={state === "running"} />
        {showHint && <HintPill />}
      </section>

      {!isModal && state === "lost" && (
        <section className="pointer-events-none fixed inset-x-0 bottom-[160px] z-10 flex flex-col items-center gap-2 px-4 animate-shake">
          <LoseBanner />
        </section>
      )}

      {!isModal && (
        <footer className="safe-pb fixed inset-x-0 bottom-0 z-20 px-4 pb-3 pt-4">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-full bg-gradient-to-t from-white/25 via-white/5 to-transparent"
          />
          <div
            className={`mx-auto flex w-full max-w-[340px] flex-col items-center ${state === "lost" ? "animate-shake" : ""}`}
          >
            <SpeechBubble>{primaryMessage[state]}</SpeechBubble>
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
          </div>
        </footer>
      )}

      {showIntro && <IntroModal onClose={() => setShowIntro(false)} />}

      {state === "won" && (
        <WinModal
          displayTime={displayTime}
          onClaim={goToPhoneInput}
        />
      )}

      {state === "phone" && (
        <PhoneModal
          phone={phone}
          error={phoneError}
          onChange={handlePhoneChange}
          onSubmit={handleSubmitPhone}
          onBack={() => setState("won")}
        />
      )}

      {state === "sent" && (
        <SentModal phone={phone} onReset={reset} />
      )}
    </main>
  );
}

function ModalBackdrop({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="dialog"
      aria-modal
      className="safe-pb fixed inset-0 z-40 flex flex-col items-center justify-center px-4 py-6 animate-fade-backdrop"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-black/70"
      />
      {children}
    </div>
  );
}

function IntroModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalBackdrop>
      <div className="flex w-full max-w-[340px] flex-col items-center gap-4 animate-burst-in rounded-[32px] border border-white/60 bg-white/95 px-5 py-6 shadow-[inset_0_2px_0_rgba(255,255,255,0.95),0_18px_40px_rgba(30,40,90,0.35)] backdrop-blur-md">
        <div className="flex flex-col items-center gap-1">
          <span className="rounded-full bg-gradient-to-b from-[#dac9f7] to-[#a58fe2] px-3.5 py-1 text-[0.72rem] font-black uppercase tracking-wider text-white [text-shadow:0_1px_0_rgba(50,30,110,0.4)]">
            game
          </span>
          <h2 className="text-[1.7rem] font-black -tracking-[0.02em] text-[#2a1f6b]">
            세차 뽑기
          </h2>
        </div>

        <Coupon glow />

        <ul className="flex w-full flex-col gap-2 rounded-2xl bg-white/70 px-4 py-3 text-[0.88rem] font-bold text-[#2a1f6b] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-2px_3px_rgba(40,50,90,0.06)]">
          <li className="flex items-start gap-2">
            <span className="mt-px text-[1rem]">⏱️</span>
            <span>
              START 누르면 타이머가 <strong className="text-[#6c5dc7]">빠르게</strong> 올라가요
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-px text-[1rem]">🎯</span>
            <span>
              <strong className="text-[#d17b00]">3.10 ~ 3.30초</strong> 사이에
              STOP!
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-px text-[1rem]">🎁</span>
            <span>
              맞추면 <strong className="text-[#b94a00]">₩1,000 세차 할인</strong>
              쿠폰 당첨!
            </span>
          </li>
        </ul>

        <PuffButton variant="start" onClick={onClose}>
          시작하기
        </PuffButton>
        <button
          type="button"
          onClick={onClose}
          className="-mt-1 text-[0.8rem] font-bold text-[#4a3f8a]/70 underline-offset-2 hover:underline"
        >
          닫기
        </button>
      </div>
    </ModalBackdrop>
  );
}

function WinModal({
  displayTime,
  onClaim,
}: {
  displayTime: string;
  onClaim: () => void;
}) {
  return (
    <ModalBackdrop>
      <Confetti />
      <div className="flex w-full max-w-[340px] flex-col items-center gap-3 animate-burst-in">
        <h2 className="relative text-[2.6rem] font-black italic -tracking-[0.02em] text-[#ff4d6b] [paint-order:stroke_fill] [-webkit-text-stroke:6px_#ffffff] [text-shadow:0_5px_0_#f4c41a,0_10px_16px_rgba(180,40,70,0.4)]">
          <Star className="-top-3 -left-5" />
          <Star className="-top-1 -right-5" />
          <Star className="bottom-0 -left-6" />
          당첨!
        </h2>
        <Pill>
          <strong className="text-[#b94a00]">{displayTime}초</strong> 딱
          맞췄어요!
        </Pill>
        <Coupon glow />
        <PuffButton variant="claim" onClick={onClaim}>
          쿠폰 발급받기
        </PuffButton>
      </div>
    </ModalBackdrop>
  );
}

function PhoneModal({
  phone,
  error,
  onChange,
  onSubmit,
  onBack,
}: {
  phone: string;
  error: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e?: FormEvent) => void;
  onBack: () => void;
}) {
  return (
    <ModalBackdrop>
      <form
        onSubmit={onSubmit}
        className="flex w-full max-w-[340px] flex-col items-center gap-3 animate-burst-in rounded-[32px] border border-white/60 bg-white/90 px-5 py-6 shadow-[inset_0_2px_0_rgba(255,255,255,0.95),0_18px_40px_rgba(30,40,90,0.35)] backdrop-blur-md"
      >
        <div className="flex flex-col items-center gap-1">
          <h2 className="text-[1.5rem] font-black -tracking-[0.02em] text-[#2a1f6b]">
            쿠폰 받을 번호 입력
          </h2>
          <p className="text-[0.82rem] font-bold text-[#4a3f8a]/85">
            입력하신 번호로 문자로 쿠폰이 발송돼요
          </p>
        </div>

        <Coupon />

        <label className="sr-only" htmlFor="phone">
          휴대폰 번호
        </label>
        <input
          id="phone"
          type="tel"
          inputMode="numeric"
          placeholder="010-0000-0000"
          value={phone}
          onChange={onChange}
          autoComplete="tel"
          autoFocus
          className="h-[58px] w-full rounded-2xl bg-white px-5 text-center text-[1.25rem] font-black tracking-wider text-[#2a1f6b] outline-none placeholder:font-bold placeholder:text-[#b4b8d9] shadow-[inset_0_2px_0_rgba(255,255,255,0.9),inset_0_-3px_6px_rgba(40,50,130,0.08),0_5px_0_#c9ceec,0_10px_18px_rgba(60,70,140,0.22)] focus:shadow-[inset_0_2px_0_rgba(255,255,255,0.9),inset_0_-3px_6px_rgba(40,50,130,0.12),0_5px_0_#9ba3dc,0_10px_18px_rgba(80,100,180,0.3)]"
        />

        {error && (
          <p className="rounded-full bg-[#ffe5de] px-3 py-1 text-[0.82rem] font-bold text-[#c64a28] shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_2px_6px_rgba(180,60,40,0.2)]">
            {error}
          </p>
        )}

        <div className="flex w-full flex-col items-center gap-2">
          <PuffButton
            variant="claim"
            onClick={() => onSubmit()}
          >
            쿠폰 발급받기
          </PuffButton>
          <button
            type="button"
            onClick={onBack}
            className="text-[0.82rem] font-bold text-[#4a3f8a]/80 underline-offset-2 hover:underline"
          >
            이전으로
          </button>
        </div>

        <button type="submit" className="sr-only" aria-hidden>
          submit
        </button>
      </form>
    </ModalBackdrop>
  );
}

function SentModal({
  phone,
  onReset,
}: {
  phone: string;
  onReset: () => void;
}) {
  return (
    <ModalBackdrop>
      <Confetti colors={["#5db7e6", "#7ae2a1", "#ffd24a", "#ffffff"]} />
      <div className="flex w-full max-w-[340px] flex-col items-center gap-3 animate-burst-in rounded-[32px] border-2 border-white bg-gradient-to-b from-white via-[#eafff5] to-[#c9f5dd] px-5 py-6 shadow-[inset_0_2px_0_rgba(255,255,255,0.95),0_18px_40px_rgba(30,90,60,0.35)]">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-b from-[#9fe9c3] to-[#3fb685] shadow-[inset_0_2px_0_rgba(255,255,255,0.7),0_6px_0_#1f7d56,0_10px_16px_rgba(30,125,86,0.4)]">
          <svg
            className="h-8 w-8"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <path
              d="M5 12.5l4.2 4.2L19 7"
              stroke="#ffffff"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="text-[1.9rem] font-black italic -tracking-[0.02em] text-[#2aa77a] [paint-order:stroke_fill] [-webkit-text-stroke:4px_#ffffff] [text-shadow:0_4px_0_#f4c41a,0_6px_12px_rgba(30,120,85,0.3)]">
          발송 완료!
        </h2>
        <p className="rounded-full bg-white/85 px-4 py-1.5 text-[0.95rem] font-black text-[#1f3a5a] shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_3px_8px_rgba(80,70,140,0.22)]">
          {phone}
        </p>
        <p className="text-[0.88rem] font-bold text-[#4a3f8a]/85">
          입력하신 번호로 쿠폰이 발송되었어요
        </p>
        <Coupon />
        <PuffButton variant="start" onClick={onReset}>
          처음으로
        </PuffButton>
      </div>
    </ModalBackdrop>
  );
}

function Confetti({
  colors = ["#ff4d6b", "#ffd24a", "#5db7e6", "#a58fe2", "#7ae2a1"],
}: {
  colors?: string[];
}) {
  const pieces = Array.from({ length: 28 }, (_, i) => i);
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {pieces.map((i) => {
        const color = colors[i % colors.length];
        const left = (i * 37) % 100;
        const delay = ((i * 73) % 800) / 1000;
        const duration = 2 + ((i * 13) % 10) / 10;
        const size = 6 + (i % 4) * 2;
        const shape = i % 3 === 0 ? "50%" : "3px";
        return (
          <span
            key={i}
            className="absolute top-0 block animate-confetti"
            style={{
              left: `${left}%`,
              width: `${size}px`,
              height: `${size * 1.3}px`,
              background: color,
              borderRadius: shape,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
              boxShadow: `0 2px 4px rgba(0,0,0,0.15)`,
            }}
          />
        );
      })}
    </div>
  );
}

const VIDEO_BY_STATE: Partial<Record<GameState, string>> = {
  running: "/running.mp4",
};

function BackgroundVideo({ state }: { state: GameState }) {
  const src = VIDEO_BY_STATE[state] ?? "/intro.mp4";
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;

    const tryPlay = async () => {
      if (cancelled) return;
      try {
        await video.play();
      } catch {
        // autoplay 차단 — 사용자 첫 터치/클릭에 한 번만 재시도
        const retry = () => {
          video.play().catch(() => {});
        };
        document.addEventListener("touchstart", retry, {
          once: true,
          passive: true,
        });
        document.addEventListener("click", retry, { once: true });
        document.addEventListener("pointerdown", retry, {
          once: true,
          passive: true,
        });
      }
    };

    if (video.readyState >= 2) {
      tryPlay();
    } else {
      const onReady = () => tryPlay();
      video.addEventListener("canplay", onReady, { once: true });
      return () => {
        cancelled = true;
        video.removeEventListener("canplay", onReady);
      };
    }

    return () => {
      cancelled = true;
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
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

function SpeechBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mb-4 animate-burst-in drop-shadow-[0_6px_14px_rgba(40,50,90,0.28)]">
      <div className="rounded-full border-2 border-white/70 bg-white px-4 py-2 text-[0.85rem] font-bold text-[#2a1f6b] shadow-[inset_0_2px_0_rgba(255,255,255,0.9),inset_0_-2px_3px_rgba(40,50,90,0.08)]">
        {children}
      </div>
      {/* 삼각형 꼬리 (버튼 방향 아래로) */}
      <svg
        aria-hidden
        className="absolute left-1/2 -bottom-[12px] -translate-x-1/2"
        width="22"
        height="14"
        viewBox="0 0 22 14"
      >
        <path
          d="M11 13 L1 1 L21 1 Z"
          fill="#ffffff"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function LoseBanner() {
  return (
    <div className="flex flex-col items-center gap-1 animate-burst-in">
      <div className="relative">
        <svg
          viewBox="0 0 80 80"
          className="h-[72px] w-[72px] drop-shadow-[0_6px_12px_rgba(30,40,90,0.35)]"
          aria-hidden
        >
          <circle cx="40" cy="40" r="34" fill="#8a98b8" stroke="#ffffff" strokeWidth="4" />
          <circle cx="40" cy="40" r="30" fill="url(#loseGrad)" />
          <ellipse cx="29" cy="36" rx="3" ry="4" fill="#1a2c45" />
          <ellipse cx="51" cy="36" rx="3" ry="4" fill="#1a2c45" />
          <path
            d="M28 55 Q40 45 52 55"
            stroke="#1a2c45"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M26 18 Q29 22 32 18"
            stroke="#1a2c45"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M48 18 Q51 22 54 18"
            stroke="#1a2c45"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <defs>
            <linearGradient id="loseGrad" x1="40" y1="10" x2="40" y2="70" gradientUnits="userSpaceOnUse">
              <stop stopColor="#c4ccdc" />
              <stop offset="1" stopColor="#8a98b8" />
            </linearGradient>
          </defs>
        </svg>
        <span className="absolute -top-1 -right-2 text-base">💧</span>
      </div>
      <h2 className="text-[1.65rem] font-black italic -tracking-[0.02em] text-[#4a3f8a] [paint-order:stroke_fill] [-webkit-text-stroke:4px_#ffffff] [text-shadow:0_3px_0_rgba(200,210,230,0.9),0_5px_10px_rgba(80,90,130,0.3)]">
        아쉬워요!
      </h2>
    </div>
  );
}

function HintPill() {
  return (
    <div className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-white/55 px-3 py-1 text-[0.72rem] font-bold text-[#2a1f6b] shadow-[0_2px_6px_rgba(30,40,90,0.25)] backdrop-blur-md">
      💡 <strong className="text-[#c27400]">3.10 ~ 3.30초</strong>
      <span className="text-[#2a1f6b]/80">사이에서 멈추면 당첨 확률 UP!</span>
    </div>
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

function Coupon({
  glow = false,
  compact = false,
}: {
  glow?: boolean;
  compact?: boolean;
}) {
  const scale = compact ? 0.82 : 1;
  const h = compact ? 70 : 84;
  const stampW = compact ? 68 : 84;
  const badgeSize = compact ? 42 : 52;

  return (
    <div
      className={`pointer-events-auto relative w-full transition-all duration-300 ${
        glow ? "animate-float" : ""
      }`}
      style={{ maxWidth: `${300 * scale}px` }}
    >
      {glow && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-[-12px] -z-10 rounded-[40px] bg-[#fff2a8]/60 blur-2xl"
        />
      )}

      {/* 티켓 본체 */}
      <div
        className="relative flex w-full overflow-hidden rounded-[22px] shadow-[inset_0_2px_0_rgba(255,255,255,0.85),inset_0_-4px_8px_rgba(170,110,0,0.3),0_6px_0_#c58a00,0_14px_20px_rgba(160,100,0,0.3)]"
        style={{
          height: `${h}px`,
          background:
            "linear-gradient(160deg, #fff6b3 0%, #ffe05a 50%, #ffb400 100%)",
        }}
      >
        {/* 좌측 스탬프 영역 */}
        <div
          className="relative flex flex-shrink-0 flex-col items-center justify-center"
          style={{ width: `${stampW}px` }}
        >
          <div
            className="flex items-center justify-center rounded-full bg-white/90 shadow-[inset_0_2px_0_rgba(255,255,255,0.95),inset_0_-3px_6px_rgba(170,110,0,0.25),0_3px_0_#d19700,0_6px_10px_rgba(160,100,0,0.25)]"
            style={{ height: `${badgeSize}px`, width: `${badgeSize}px` }}
          >
            <span
              className="font-black leading-none text-[#a23e00] [text-shadow:0_1px_0_rgba(255,255,255,0.5)]"
              style={{ fontSize: compact ? "1.3rem" : "1.55rem" }}
            >
              ₩
            </span>
          </div>
          <span
            className="mt-1 font-black uppercase tracking-[0.1em] text-[#a23e00]/80"
            style={{ fontSize: compact ? "0.5rem" : "0.58rem" }}
          >
            coupon
          </span>
        </div>

        {/* 점선 perforation */}
        <div
          aria-hidden
          className="flex h-full flex-col items-center justify-center gap-[5px]"
        >
          {Array.from({ length: compact ? 9 : 11 }).map((_, i) => (
            <span
              key={i}
              className="h-[3px] w-[2px] rounded-full bg-[#a23e00]/35"
            />
          ))}
        </div>

        {/* 우측 메인 금액 영역 */}
        <div className="flex flex-1 flex-col items-center justify-center px-2 leading-none">
          <span
            className="font-black -tracking-[0.03em] text-[#a23e00] [text-shadow:0_2px_0_#fff2a8,0_3px_0_rgba(255,255,255,0.9),0_4px_6px_rgba(140,80,0,0.25)]"
            style={{ fontSize: compact ? "1.45rem" : "1.75rem" }}
          >
            ₩1,000
          </span>
          <span
            className="mt-0.5 font-extrabold text-[#a23e00] [text-shadow:0_1px_0_#fff2a8]"
            style={{ fontSize: compact ? "0.78rem" : "0.88rem" }}
          >
            세차 할인 쿠폰
          </span>
        </div>

        {/* 상단 하이라이트 띠 */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[14px] bg-gradient-to-b from-white/55 to-transparent"
        />
      </div>

      {/* 좌우 사이드 노치 시각 힌트 */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-0 top-1/2 h-[22px] w-[22px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/0 shadow-[inset_0_0_0_2px_rgba(162,62,0,0.25)]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/2 h-[22px] w-[22px] translate-x-1/2 -translate-y-1/2 rounded-full bg-white/0 shadow-[inset_0_0_0_2px_rgba(162,62,0,0.25)]"
      />
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
