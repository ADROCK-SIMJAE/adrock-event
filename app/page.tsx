"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type EventKey = "fuel" | "wash" | "drive" | "box";
type TabKey = "join" | "winners";

type EventDef = {
  key: EventKey;
  title: string;
  subtitle: string;
  illust: string;
  href: string | null;
};

const EVENTS: EventDef[] = [
  { key: "fuel",  title: "주유 찬스",      subtitle: "주유권 응모",   illust: "/icons/illust-fuel.png",  href: null },
  { key: "wash",  title: "세차 뽑기",      subtitle: "세차 쿠폰 응모", illust: "/icons/illust-wash.png",  href: "/wash" },
  { key: "drive", title: "드라이브 리워드", subtitle: "주행권 응모",   illust: "/icons/illust-drive.png", href: null },
  { key: "box",   title: "혜택 박스",      subtitle: "쿠폰 묶음 응모", illust: "/icons/illust-box.png",   href: null },
];

const WINNERS: { name: string; reward: string; amount: string; ago: string; icon: EventKey }[] = [
  { name: "hans***",     reward: "주유권",   amount: "5,000원",  ago: "3분 전",   icon: "fuel" },
  { name: "자동차***",    reward: "주유권",   amount: "3,000원",  ago: "5분 전",   icon: "fuel" },
  { name: "love***",     reward: "혜택 박스", amount: "10,000원", ago: "10분 전",  icon: "box"  },
  { name: "good***",     reward: "주유권",   amount: "5,000원",  ago: "20분 전",  icon: "fuel" },
  { name: "드라이버***",  reward: "주유권",   amount: "2,000원",  ago: "30분 전",  icon: "drive"},
  { name: "user***",     reward: "주유권",   amount: "5,000원",  ago: "1시간 전", icon: "fuel" },
  { name: "clean***",    reward: "세차권",   amount: "3,000원",  ago: "5시간 전", icon: "wash" },
  { name: "fast***",     reward: "주유권",   amount: "5,000원",  ago: "24시간 전", icon: "fuel" },
];

const ILLUST_BY_KEY: Record<EventKey, string> = {
  fuel:  "/icons/illust-fuel.png",
  wash:  "/icons/illust-wash.png",
  drive: "/icons/illust-drive.png",
  box:   "/icons/illust-box.png",
};

export default function Home() {
  const [tab, setTab] = useState<TabKey>("join");
  const [toast, setToast] = useState<string | null>(null);

  const showSoon = (label: string) => {
    setToast(`${label}은 곧 오픈돼요!`);
    window.setTimeout(() => setToast(null), 1600);
  };

  return (
    <main
      className="relative min-h-[100dvh] overflow-x-hidden"
      style={{
        background:
          "linear-gradient(to bottom, #ffd84a 0%, #ffe89a 6%, #fff3c8 14%, #fdf6e6 26%, #fafaf3 45%, #f7f7f2 100%)",
      }}
    >
      <BgDots />

      <div className="safe-pb relative mx-auto flex w-full max-w-[420px] flex-col gap-3 px-4 pb-6 pt-3">
        <Header />
        <Tabs tab={tab} onChange={setTab} />

        {tab === "join" ? (
          <JoinView showSoon={showSoon} />
        ) : (
          <WinnersFullView />
        )}

        <InfoStrip />
        <MoreEvents showSoon={showSoon} />
      </div>

      {toast && <Toast msg={toast} />}
    </main>
  );
}

/* ──────── Header ──────── */

function Header() {
  return (
    <header className="relative grid h-[64px] grid-cols-[1fr_auto] items-center">
      <div className="relative pl-2">
        {/* 별 장식 */}
        <span aria-hidden className="pointer-events-none absolute -left-1 -top-1 text-[#ffae1a] animate-burst-stars">
          <SparkleSvg size={14} />
        </span>
        <span
          aria-hidden
          className="pointer-events-none absolute right-0 top-1 text-[#ff5a4b] animate-burst-stars"
          style={{ animationDelay: "0.6s" }}
        >
          <SparkleSvg size={10} />
        </span>

        {/* 타이틀: 글리치 효과 (3중 레이어) */}
        <div className="relative inline-block">
          <h1
            aria-hidden
            className="pointer-events-none absolute inset-0 animate-title-glitch text-[1.6rem] font-black -tracking-[0.02em] text-[#ff5a4b] opacity-30"
            style={{ animationDelay: "0s" }}
          >
            오늘의 혜택존
          </h1>
          <h1
            aria-hidden
            className="pointer-events-none absolute inset-0 animate-title-glitch text-[1.6rem] font-black -tracking-[0.02em] text-[#3ecbff] opacity-25"
            style={{ animationDelay: "0.18s" }}
          >
            오늘의 혜택존
          </h1>
          <h1 className="relative text-[1.6rem] font-black -tracking-[0.02em] text-[#2a1f6b] [paint-order:stroke_fill] [-webkit-text-stroke:6px_#ffffff] [text-shadow:0_3px_0_rgba(255,255,255,0.95),0_5px_12px_rgba(140,90,0,0.4)]">
            오늘의 혜택존
          </h1>
        </div>
      </div>

      <BadgeIcon />
    </header>
  );
}

function BadgeIcon() {
  return (
    <div className="relative h-[72px] w-[80px]">
      {/* 폭죽 별 */}
      <span aria-hidden className="absolute -left-1 top-1 text-[#ff5a4b] animate-twinkle z-10">
        <SparkleSvg size={11} />
      </span>
      <span
        aria-hidden
        className="absolute -right-0 top-3 text-[#ffae1a] animate-twinkle z-10"
        style={{ animationDelay: "0.4s" }}
      >
        <SparkleSvg size={9} />
      </span>
      <span
        aria-hidden
        className="absolute bottom-0 left-3 text-[#3ecbff] animate-twinkle z-10"
        style={{ animationDelay: "0.7s" }}
      >
        <SparkleSvg size={8} />
      </span>

      {/* 배지 본체 */}
      <div className="relative h-full w-full animate-badge-wiggle">
        <Image
          src="/icons/badge-logo.png"
          alt="혜택존"
          fill
          sizes="80px"
          priority
          className="object-contain"
        />
      </div>
    </div>
  );
}

/* ──────── Tabs ──────── */

function Tabs({ tab, onChange }: { tab: TabKey; onChange: (t: TabKey) => void }) {
  return (
    <div className="flex w-full gap-1.5 rounded-2xl bg-[#dfa600]/30 p-1 shadow-[inset_0_2px_4px_rgba(140,90,0,0.18)]">
      {(["join", "winners"] as TabKey[]).map((k) => {
        const active = tab === k;
        return (
          <button
            key={k}
            type="button"
            onClick={() => onChange(k)}
            className={`relative flex-1 h-11 rounded-xl text-[0.95rem] font-black -tracking-[0.01em] transition-all ${
              active
                ? "animate-tab-pulse bg-white text-[#2a1f6b] shadow-[inset_0_2px_0_rgba(255,255,255,0.95),0_3px_0_#d4a300,0_5px_8px_rgba(150,100,0,0.25)]"
                : "text-[#7a3a00]/85 active:scale-95"
            }`}
          >
            {k === "join" ? "이벤트 참여" : "당첨자 현황"}
            {active && (
              <span
                aria-hidden
                className="pointer-events-none absolute -top-1 right-2 text-[#ffae1a] animate-twinkle"
              >
                <SparkleSvg size={10} />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ──────── Join View: 2x2 Cards + Winners Panel ──────── */

function JoinView({ showSoon }: { showSoon: (l: string) => void }) {
  return (
    <section className="grid grid-cols-[1.7fr_1fr] items-stretch gap-2">
      <div className="grid auto-rows-fr grid-cols-2 gap-2">
        {EVENTS.map((ev, i) => (
          <EventCard key={ev.key} event={ev} index={i} onSoon={showSoon} />
        ))}
      </div>
      <WinnersPanel />
    </section>
  );
}

function EventCard({
  event,
  index,
  onSoon,
}: {
  event: EventDef;
  index: number;
  onSoon: (l: string) => void;
}) {
  const isMystery = event.key === "drive" || event.key === "box";
  const Frame = (
    <div
      className="relative flex h-full animate-card-pop-in flex-col items-center gap-1 rounded-[22px] border-2 border-white bg-white px-2 pt-2 pb-2 shadow-[inset_0_2px_0_rgba(255,255,255,0.95),inset_0_-3px_5px_rgba(60,80,140,0.1),0_5px_0_#e6cf7a,0_10px_18px_rgba(180,130,0,0.25)]"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div
        className="relative aspect-square w-full overflow-hidden rounded-[16px] bg-[#fff7d8] animate-card-wobble"
        style={{ animationDelay: `${index * 0.2}s` }}
      >
        {isMystery ? (
          <MysteryIcon />
        ) : (
          <div className="absolute inset-0 animate-float">
            <Image
              src={event.illust}
              alt=""
              fill
              sizes="(max-width: 420px) 40vw, 200px"
              className="object-cover"
            />
          </div>
        )}
      </div>
      <div className="flex flex-col items-center gap-0 pt-0.5 leading-tight">
        <span className="text-[0.92rem] font-black -tracking-[0.02em] text-[#2a1f6b]">
          {event.title}
        </span>
        <span className="text-[0.66rem] font-bold text-[#4a3f8a]/80">
          {event.subtitle}
        </span>
      </div>
      <span className="relative mt-auto inline-flex h-7 w-full items-center justify-center overflow-hidden rounded-full bg-gradient-to-b from-[#fff3a8] via-[#ffd84a] to-[#ffae1a] text-[0.74rem] font-black text-[#7a3a00] animate-btn-glow active:translate-y-[1px]">
        참여하기
        {/* 빛 sheen */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-btn-sheen bg-gradient-to-r from-transparent via-white/80 to-transparent"
          style={{ animationDelay: `${index * 0.3}s` }}
        />
      </span>
    </div>
  );

  if (event.href) {
    return (
      <Link href={event.href} aria-label={`${event.title} 참여하기`} className="block h-full">
        {Frame}
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={() => onSoon(event.title)}
      aria-label={`${event.title} 참여하기`}
      className="block h-full w-full text-left"
    >
      {Frame}
    </button>
  );
}

/* ──────── Winners Panel (right column) ──────── */

function WinnersPanel() {
  const loop = [...WINNERS, ...WINNERS];
  return (
    <div className="flex h-full flex-col gap-1 overflow-hidden rounded-[22px] border-2 border-white bg-white/95 px-1.5 py-2 shadow-[inset_0_2px_0_rgba(255,255,255,0.95),inset_0_-3px_5px_rgba(60,80,140,0.08),0_5px_0_#e6cf7a,0_10px_18px_rgba(180,130,0,0.22)]">
      <div className="flex items-center justify-between px-0.5">
        <span className="inline-flex items-center gap-1 rounded-full bg-[#ff5a4b] px-1.5 py-[1px] text-[0.5rem] font-black text-white shadow-[0_1px_0_rgba(180,40,30,0.5)]">
          <span className="h-1 w-1 animate-live-blink rounded-full bg-white" />
          LIVE
        </span>
        <button
          type="button"
          className="inline-flex items-center gap-0.5 text-[0.55rem] font-bold text-[#4a3f8a]/70"
          aria-label="새로고침"
        >
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M3 12a9 9 0 0 1 15.5-6.3M21 4v6h-6M21 12a9 9 0 0 1-15.5 6.3M3 20v-6h6"
              stroke="#4a3f8a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
          새로고침
        </button>
      </div>
      <div className="relative flex-1 overflow-hidden">
        <ul className="absolute inset-x-0 top-0 flex animate-marquee-y flex-col gap-1 will-change-transform">
          {loop.map((w, i) => (
            <li
              key={i}
              className="flex items-center gap-1.5 rounded-lg bg-[#fffaec] px-1 py-0.5"
            >
              <MiniIcon kind={w.icon} />
              <div className="flex min-w-0 flex-1 flex-col leading-tight">
                <span className="truncate text-[0.66rem] font-black text-[#2a1f6b]">{w.name}</span>
                <span className="truncate text-[0.56rem] font-bold text-[#4a3f8a]/85">
                  {w.reward} {w.amount}
                </span>
              </div>
              <span className="whitespace-nowrap text-[0.5rem] font-bold text-[#4a3f8a]/65">
                {w.ago}
              </span>
            </li>
          ))}
        </ul>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-3 bg-gradient-to-b from-white to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3 bg-gradient-to-t from-white to-transparent" />
      </div>
    </div>
  );
}

function MiniIcon({ kind }: { kind: EventKey }) {
  return (
    <span className="relative h-7 w-7 flex-shrink-0 overflow-hidden rounded-lg border border-white shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_2px_4px_rgba(80,70,140,0.18)]">
      <Image src={ILLUST_BY_KEY[kind]} alt="" fill sizes="32px" className="object-cover" />
    </span>
  );
}

/* ──────── Winners Tab Full View ──────── */

function WinnersFullView() {
  const loop = [...WINNERS, ...WINNERS];
  return (
    <section className="relative overflow-hidden rounded-[22px] border-2 border-white bg-white/95 px-3 py-3 shadow-[inset_0_2px_0_rgba(255,255,255,0.95),0_5px_0_#e6cf7a,0_10px_18px_rgba(180,130,0,0.22)]">
      {/* 배경 별 장식 */}
      <span aria-hidden className="pointer-events-none absolute right-3 top-2 text-[#ffae1a] animate-twinkle z-10">
        <SparkleSvg size={14} />
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute left-2 bottom-12 text-[#3ecbff] animate-twinkle z-10"
        style={{ animationDelay: "0.5s" }}
      >
        <SparkleSvg size={10} />
      </span>

      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#ff5a4b] px-2 py-[2px] text-[0.6rem] font-black text-white shadow-[0_2px_0_rgba(180,40,30,0.5)]">
            <span className="h-1.5 w-1.5 animate-live-blink rounded-full bg-white" />
            LIVE
          </span>
          <h2 className="animate-title-pop text-[1rem] font-black text-[#2a1f6b]">
            실시간 당첨자
          </h2>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1 text-[0.72rem] font-bold text-[#4a3f8a]/70"
        >
          <span className="inline-block animate-rotate-slow">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M3 12a9 9 0 0 1 15.5-6.3M21 4v6h-6M21 12a9 9 0 0 1-15.5 6.3M3 20v-6h6"
                stroke="#4a3f8a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          새로고침
        </button>
      </div>

      {/* 마퀴 영역 */}
      <div className="relative h-[420px] overflow-hidden">
        <ul
          className="absolute inset-x-0 top-0 flex flex-col gap-2 will-change-transform"
          style={{ animation: "marquee-y 28s linear infinite" }}
        >
          {loop.map((w, i) => (
            <li
              key={i}
              className="flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-[#fff8e1] to-[#fffdf2] px-2 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_0_rgba(230,207,122,0.55)]"
            >
              <span className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-xl border-2 border-white shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_2px_4px_rgba(80,70,140,0.18)]">
                {w.icon === "wash" || w.icon === "fuel" ? (
                  <span
                    className="absolute inset-0 block animate-icon-hop"
                    style={{ animationDelay: `${(i % WINNERS.length) * 0.1}s` }}
                  >
                    <Image src={ILLUST_BY_KEY[w.icon]} alt="" fill sizes="44px" className="object-cover" />
                  </span>
                ) : (
                  <MysteryIcon />
                )}
              </span>
              <div className="flex min-w-0 flex-1 flex-col leading-tight">
                <span className="truncate text-[0.88rem] font-black text-[#2a1f6b]">{w.name}</span>
                <span className="truncate text-[0.74rem] font-bold text-[#4a3f8a]/85">
                  {w.reward} <span className="text-[#7a3a00]">{w.amount}</span>
                </span>
              </div>
              <span className="whitespace-nowrap text-[0.7rem] font-bold text-[#4a3f8a]/65">
                {w.ago}
              </span>
            </li>
          ))}
        </ul>
        {/* 위/아래 페이드 마스크 */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-white to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-white to-transparent" />
      </div>
    </section>
  );
}

/* ──────── Info Strip ──────── */

function InfoStrip() {
  const items: { icon: React.ReactNode; label: React.ReactNode }[] = [
    {
      icon: <CalendarIcon />,
      label: <>매일 새로운<br />이벤트 오픈</>,
    },
    {
      icon: <UpIcon />,
      label: <>참여할수록<br />당첨 확률 UP!</>,
    },
    {
      icon: <BellIcon />,
      label: <>당첨 결과는<br />실시간 확인</>,
    },
  ];
  return (
    <section className="rounded-[22px] border-2 border-white bg-white/85 px-3 py-3 shadow-[inset_0_2px_0_rgba(255,255,255,0.95),0_5px_0_#e6cf7a,0_10px_18px_rgba(180,130,0,0.22)]">
      <ul className="grid grid-cols-3 gap-1 text-center">
        {items.map((it, i) => (
          <li key={i} className="flex flex-col items-center gap-1.5">
            <span
              className="flex h-9 w-9 animate-icon-hop items-center justify-center rounded-full bg-gradient-to-b from-[#fff3a8] via-[#ffd84a] to-[#ffae1a] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_0_#c98800,0_4px_6px_rgba(180,120,0,0.3)]"
              style={{ animationDelay: `${i * 0.25}s` }}
            >
              {it.icon}
            </span>
            <span className="text-[0.7rem] font-bold leading-snug text-[#2a1f6b]">
              {it.label}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ──────── More Events ──────── */

function MoreEvents({ showSoon }: { showSoon: (l: string) => void }) {
  return (
    <section className="rounded-[22px] border-2 border-white bg-white/85 px-3 pt-3 pb-3 shadow-[inset_0_2px_0_rgba(255,255,255,0.95),0_5px_0_#e6cf7a,0_10px_18px_rgba(180,130,0,0.22)]">
      <div className="mb-2 flex items-center justify-center gap-1.5">
        <span className="inline-block animate-emoji-wave text-[0.92rem]">👉</span>
        <span className="animate-title-pop text-[0.92rem] font-black -tracking-[0.01em] text-[#2a1f6b]">
          더 많은 혜택 둘러보기
        </span>
        <span aria-hidden className="text-[#ffae1a] animate-twinkle">
          <SparkleSvg size={10} />
        </span>
      </div>
      <ul className="grid grid-cols-4 items-start gap-2">
        {EVENTS.map((ev, i) => {
          const isMystery = ev.key !== "wash";
          const cell = (
            <span className="flex h-full flex-col items-center gap-1">
              <span
                className="relative block aspect-square w-full overflow-hidden rounded-2xl border-2 border-white bg-[#fff7d8] shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_3px_0_#e6cf7a,0_6px_10px_rgba(180,130,0,0.22)] animate-card-wobble"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                {isMystery ? (
                  <MysteryIcon />
                ) : (
                  <span className="absolute inset-0 block animate-float">
                    <Image src={ev.illust} alt="" fill sizes="(max-width:420px) 22vw, 100px" className="object-cover" />
                  </span>
                )}
              </span>
              <span className="block min-h-[2.2em] text-center text-[0.62rem] font-black leading-tight text-[#2a1f6b]">
                {ev.title}
              </span>
            </span>
          );
          return ev.href ? (
            <li key={ev.key}>
              <Link href={ev.href} aria-label={ev.title}>
                {cell}
              </Link>
            </li>
          ) : (
            <li key={ev.key}>
              <button
                type="button"
                onClick={() => showSoon(ev.title)}
                aria-label={ev.title}
                className="block w-full"
              >
                {cell}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ──────── Toast ──────── */

function Toast({ msg }: { msg: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 animate-burst-in rounded-2xl bg-[#2a1f6b]/90 px-5 py-3 text-[0.95rem] font-black text-white shadow-[0_10px_30px_rgba(30,40,90,0.4)] backdrop-blur-sm"
    >
      {msg}
    </div>
  );
}

/* ──────── BG Dots ──────── */

function BgDots() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-35"
      style={{
        background:
          "radial-gradient(circle at 12% 8%, rgba(255,255,255,0.85) 0 5px, transparent 6px), radial-gradient(circle at 82% 14%, rgba(255,255,255,0.7) 0 4px, transparent 5px), radial-gradient(circle at 22% 68%, rgba(255,255,255,0.55) 0 6px, transparent 7px), radial-gradient(circle at 92% 84%, rgba(255,255,255,0.6) 0 5px, transparent 6px)",
      }}
    />
  );
}

/* ──────── Mystery Icon ──────── */

function MysteryIcon() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-[#fff7c2] via-[#ffd84a] to-[#ffae1a]">
      {/* shimmer */}
      <div
        aria-hidden
        className="absolute inset-0 animate-shimmer bg-[length:220%_100%] opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.55) 50%, transparent 75%)",
        }}
      />

      {/* 별 + 작은 ?를 모두 SVG 안에서 viewBox 기준으로 배치 */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          <filter id="msySoft" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="1.2" floodColor="#7a3a00" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* 별 4개 - viewBox 기준 */}
        <g fill="#ffffff" filter="url(#msySoft)">
          <g
            className="origin-center animate-twinkle"
            style={{ transformOrigin: "20px 22px", animationDelay: "0s" }}
          >
            <path d="M20 14 L22 20 L28 22 L22 24 L20 30 L18 24 L12 22 L18 20 Z" />
          </g>
          <g
            className="animate-twinkle"
            style={{ transformOrigin: "82px 18px", animationDelay: "0.35s" }}
          >
            <path d="M82 12 L84 17 L89 19 L84 21 L82 26 L80 21 L75 19 L80 17 Z" />
          </g>
          <g
            className="animate-twinkle"
            style={{ transformOrigin: "82px 80px", animationDelay: "0.7s" }}
          >
            <path d="M82 74 L84 79 L89 81 L84 83 L82 88 L80 83 L75 81 L80 79 Z" />
          </g>
          <g
            className="animate-twinkle"
            style={{ transformOrigin: "16px 76px", animationDelay: "1.05s" }}
          >
            <path d="M16 70 L17.5 74 L21.5 75.5 L17.5 77 L16 81 L14.5 77 L10.5 75.5 L14.5 74 Z" />
          </g>
        </g>

        {/* 작은 ? 3개 */}
        <g
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fill="#ffffff"
          opacity="0.85"
        >
          <text
            x="14"
            y="60"
            fontSize="14"
            className="animate-tiny-float"
            style={{ transformOrigin: "14px 60px", animationDelay: "0.2s" }}
          >
            ?
          </text>
          <text
            x="84"
            y="44"
            fontSize="12"
            className="animate-tiny-float"
            style={{ transformOrigin: "84px 44px", animationDelay: "0.9s" }}
          >
            ?
          </text>
          <text
            x="78"
            y="62"
            fontSize="10"
            className="animate-tiny-float"
            style={{ transformOrigin: "78px 62px", animationDelay: "1.6s" }}
          >
            ?
          </text>
        </g>

        {/* 중앙 큰 ? */}
        <g
          className="animate-mystery-bob"
          style={{ transformOrigin: "50px 55px" }}
        >
          <text
            x="50"
            y="72"
            textAnchor="middle"
            fontSize="62"
            fontWeight="900"
            fontFamily="system-ui, -apple-system, sans-serif"
            fill="#2a1f6b"
            stroke="#ffffff"
            strokeWidth="9"
            strokeLinejoin="round"
            style={{ paintOrder: "stroke fill" }}
          >
            ?
          </text>
        </g>
      </svg>
    </div>
  );
}

function SparkleSvg({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      style={{ filter: "drop-shadow(0 1px 2px rgba(120,80,0,0.25))" }}
    >
      <path d="M12 2 L13.6 9 L20 11 L13.6 13 L12 22 L10.4 13 L4 11 L10.4 9 Z" />
    </svg>
  );
}

/* ──────── Mini Pictograms ──────── */

function CalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="3" fill="#ffffff" stroke="#7a3a00" strokeWidth="2" />
      <path d="M3 10h18" stroke="#7a3a00" strokeWidth="2" />
      <path d="M8 3v4M16 3v4" stroke="#7a3a00" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="15" r="2" fill="#ff5a4b" />
    </svg>
  );
}

function UpIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 15l7-7 7 7" stroke="#7a3a00" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M5 19l7-7 7 7" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.9" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2.5h-15z" fill="#ffffff" stroke="#7a3a00" strokeWidth="2" strokeLinejoin="round" />
      <path d="M10 19a2 2 0 0 0 4 0" stroke="#7a3a00" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="18" cy="6" r="3" fill="#ff5a4b" stroke="#ffffff" strokeWidth="1.4" />
    </svg>
  );
}
