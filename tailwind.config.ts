import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Pretendard"',
          '"SUIT"',
          '"Apple SD Gothic Neo"',
          "sans-serif",
        ],
      },
      keyframes: {
        pop: {
          "0%": { transform: "scale(0.4)", opacity: "0" },
          "60%": { transform: "scale(1.18)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        twinkle: {
          "0%, 100%": {
            transform: "scale(0.9) rotate(0deg)",
            opacity: "0.7",
          },
          "50%": {
            transform: "scale(1.15) rotate(20deg)",
            opacity: "1",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        "pulse-fast": {
          "0%, 100%": {
            transform: "scale(1)",
            boxShadow:
              "0 5px 0 #09192e, 0 10px 18px rgba(20,60,90,0.28), inset 0 2px 4px rgba(255,255,255,0.1)",
          },
          "50%": {
            transform: "scale(1.03)",
            boxShadow:
              "0 5px 0 #09192e, 0 12px 22px rgba(20,60,90,0.38), 0 0 0 4px rgba(255,255,255,0.35), inset 0 2px 4px rgba(255,255,255,0.1)",
          },
        },
        "urgent-pulse": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.035)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "15%": { transform: "translateX(-8px) rotate(-1deg)" },
          "30%": { transform: "translateX(8px) rotate(1deg)" },
          "45%": { transform: "translateX(-6px) rotate(-0.5deg)" },
          "60%": { transform: "translateX(6px) rotate(0.5deg)" },
          "75%": { transform: "translateX(-3px)" },
          "90%": { transform: "translateX(3px)" },
        },
        "red-flash": {
          "0%, 100%": { opacity: "0" },
          "15%": { opacity: "0.55" },
          "50%": { opacity: "0" },
        },
        confetti: {
          "0%": { transform: "translateY(-100vh) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateY(110vh) rotate(720deg)", opacity: "0" },
        },
        "burst-in": {
          "0%": { transform: "scale(0.3)", opacity: "0" },
          "60%": { transform: "scale(1.12)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "fade-backdrop": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "button-tap": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(0.94)" },
        },
        "mystery-bob": {
          "0%": { transform: "translateY(0) rotate(-10deg) scale(1)" },
          "20%": { transform: "translateY(-9px) rotate(8deg) scale(1.12)" },
          "40%": { transform: "translateY(-2px) rotate(-6deg) scale(0.96)" },
          "60%": { transform: "translateY(-7px) rotate(10deg) scale(1.08)" },
          "80%": { transform: "translateY(-3px) rotate(-4deg) scale(1.02)" },
          "100%": { transform: "translateY(0) rotate(-10deg) scale(1)" },
        },
        "mystery-spin": {
          "0%, 90%, 100%": { transform: "rotate(0deg) scale(1)" },
          "45%": { transform: "rotate(360deg) scale(1.18)" },
        },
        "tiny-float": {
          "0%, 100%": { transform: "translate(0,0) rotate(0deg) scale(1)" },
          "33%": { transform: "translate(4px,-10px) rotate(18deg) scale(1.2)" },
          "66%": { transform: "translate(-4px,-6px) rotate(-12deg) scale(0.9)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        "marquee-y": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-50%)" },
        },
        "winner-glow": {
          "0%, 100%": { boxShadow: "0 0 0 rgba(255,200,40,0)" },
          "50%": { boxShadow: "0 0 0 3px rgba(255,200,40,0.45)" },
        },
        "live-blink": {
          "0%, 60%, 100%": { opacity: "1", transform: "scale(1)" },
          "30%": { opacity: "0.35", transform: "scale(0.7)" },
        },
        "card-wobble": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "25%": { transform: "translateY(-3px) rotate(-1deg)" },
          "50%": { transform: "translateY(0) rotate(0deg)" },
          "75%": { transform: "translateY(-2px) rotate(1deg)" },
        },
        "btn-glow": {
          "0%, 100%": {
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.9), 0 2px 0 #c98800, 0 3px 5px rgba(180,120,0,0.3)",
            transform: "translateY(0)",
          },
          "50%": {
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.9), 0 4px 0 #c98800, 0 6px 14px rgba(255,180,40,0.6), 0 0 0 3px rgba(255,220,80,0.4)",
            transform: "translateY(-1px)",
          },
        },
        "btn-sheen": {
          "0%": { transform: "translateX(-150%) skewX(-20deg)" },
          "60%, 100%": { transform: "translateX(220%) skewX(-20deg)" },
        },
        "badge-wiggle": {
          "0%, 100%": { transform: "rotate(-4deg) scale(1)" },
          "25%": { transform: "rotate(6deg) scale(1.06)" },
          "50%": { transform: "rotate(-3deg) scale(1.02)" },
          "75%": { transform: "rotate(5deg) scale(1.05)" },
        },
        "icon-hop": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "30%": { transform: "translateY(-4px) rotate(-6deg)" },
          "60%": { transform: "translateY(-2px) rotate(6deg)" },
        },
        "title-pop": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.04)" },
          "100%": { transform: "scale(1)" },
        },
        "card-pop-in": {
          "0%": { transform: "translateY(20px) scale(0.85)", opacity: "0" },
          "60%": { transform: "translateY(-4px) scale(1.04)", opacity: "1" },
          "100%": { transform: "translateY(0) scale(1)", opacity: "1" },
        },
        "rotate-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "tab-pulse": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.02)" },
        },
        "emoji-wave": {
          "0%, 100%": { transform: "rotate(0deg)" },
          "20%": { transform: "rotate(-18deg)" },
          "40%": { transform: "rotate(14deg)" },
          "60%": { transform: "rotate(-10deg)" },
          "80%": { transform: "rotate(6deg)" },
        },
        "title-glitch": {
          "0%, 100%": { transform: "translate(0,0)", opacity: "1" },
          "10%": { transform: "translate(-1px,1px)" },
          "20%": { transform: "translate(1px,-1px)" },
          "30%": { transform: "translate(-2px,0)" },
          "40%": { transform: "translate(2px,1px)" },
          "50%": { transform: "translate(0,0)" },
          "92%": { transform: "translate(0,0)" },
          "94%": { transform: "translate(-3px,1px)", opacity: "0.95" },
          "96%": { transform: "translate(3px,-1px)" },
          "98%": { transform: "translate(-1px,2px)" },
        },
        "title-rainbow": {
          "0%, 100%": { color: "#2a1f6b" },
          "33%": { color: "#7a3a00" },
          "66%": { color: "#3a2d8a" },
        },
        "burst-stars": {
          "0%, 100%": { transform: "rotate(0deg) scale(0.85)", opacity: "0.6" },
          "50%": { transform: "rotate(180deg) scale(1.25)", opacity: "1" },
        },
      },
      animation: {
        pop: "pop 0.45s ease-out both",
        twinkle: "twinkle 0.9s ease-in-out infinite",
        float: "float 2.4s ease-in-out infinite",
        "pulse-fast": "pulse-fast 0.5s ease-in-out infinite",
        "urgent-pulse": "urgent-pulse 0.45s ease-in-out infinite",
        shake: "shake 0.6s ease-in-out both",
        "red-flash": "red-flash 0.6s ease-out both",
        confetti: "confetti 2.8s ease-in forwards",
        "burst-in": "burst-in 0.55s cubic-bezier(.34,1.6,.64,1) both",
        "fade-backdrop": "fade-backdrop 0.3s ease-out both",
        "mystery-bob": "mystery-bob 1.4s ease-in-out infinite",
        "mystery-spin": "mystery-spin 4.5s ease-in-out infinite",
        "tiny-float": "tiny-float 1.8s ease-in-out infinite",
        shimmer: "shimmer 2.2s linear infinite",
        "marquee-y": "marquee-y 12s linear infinite",
        "winner-glow": "winner-glow 1.8s ease-in-out infinite",
        "live-blink": "live-blink 1s ease-in-out infinite",
        "card-wobble": "card-wobble 3s ease-in-out infinite",
        "btn-glow": "btn-glow 1.6s ease-in-out infinite",
        "btn-sheen": "btn-sheen 2.6s ease-in-out infinite",
        "badge-wiggle": "badge-wiggle 1.6s ease-in-out infinite",
        "icon-hop": "icon-hop 1.4s ease-in-out infinite",
        "title-pop": "title-pop 2.2s ease-in-out infinite",
        "card-pop-in": "card-pop-in 0.7s cubic-bezier(.34,1.6,.64,1) both",
        "rotate-slow": "rotate-slow 6s linear infinite",
        "tab-pulse": "tab-pulse 1.6s ease-in-out infinite",
        "emoji-wave": "emoji-wave 1.8s ease-in-out infinite",
        "title-glitch": "title-glitch 3.6s ease-in-out infinite",
        "title-rainbow": "title-rainbow 4s ease-in-out infinite",
        "burst-stars": "burst-stars 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
