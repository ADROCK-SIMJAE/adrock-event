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
      },
      animation: {
        pop: "pop 0.45s ease-out both",
        twinkle: "twinkle 1.2s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        "pulse-fast": "pulse-fast 0.5s ease-in-out infinite",
        "urgent-pulse": "urgent-pulse 0.45s ease-in-out infinite",
        shake: "shake 0.6s ease-in-out both",
        "red-flash": "red-flash 0.6s ease-out both",
        confetti: "confetti 2.8s ease-in forwards",
        "burst-in": "burst-in 0.55s cubic-bezier(.34,1.6,.64,1) both",
        "fade-backdrop": "fade-backdrop 0.3s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
