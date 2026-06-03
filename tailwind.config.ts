import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        "brand-purple": "#7C3AED",
        "brand-cyan": "#06B6D4",
        "dark-bg": "#0A0A0F",
        "dark-card": "#111118",
        "dark-border": "#1E1E2E",
        "text-primary": "#F8F8FF",
        "text-muted": "#6B7280"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        mono: ["var(--font-fira-code)", "Fira Code", "monospace"]
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(124, 58, 237, 0.35)" },
          "50%": { boxShadow: "0 0 36px rgba(6, 182, 212, 0.45)" }
        },
        "float-particle": {
          "0%, 100%": { transform: "translate3d(0, 0, 0)", opacity: "0.28" },
          "50%": { transform: "translate3d(18px, -32px, 0)", opacity: "0.7" }
        }
      },
      animation: {
        "fade-in-up": "fade-in-up 0.7s ease-out both",
        "glow-pulse": "glow-pulse 2.8s ease-in-out infinite",
        "float-particle": "float-particle 8s ease-in-out infinite"
      },
      boxShadow: {
        neon: "0 0 24px rgba(124, 58, 237, 0.38), 0 0 42px rgba(6, 182, 212, 0.18)"
      }
    }
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        ".glass": {
          background: "rgba(17, 17, 24, 0.72)",
          border: "1px solid rgba(30, 30, 46, 0.95)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)"
        },
        ".glass-strong": {
          background: "rgba(17, 17, 24, 0.88)",
          border: "1px solid rgba(124, 58, 237, 0.28)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)"
        }
      });
    })
  ]
};

export default config;
