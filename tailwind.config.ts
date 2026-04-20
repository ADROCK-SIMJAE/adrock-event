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
      },
      animation: {
        pop: "pop 0.45s ease-out both",
        twinkle: "twinkle 1.2s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        "pulse-fast": "pulse-fast 0.5s ease-in-out infinite",
        "urgent-pulse": "urgent-pulse 0.45s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
