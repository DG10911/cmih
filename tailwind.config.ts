import type { Config } from "tailwindcss";

/**
 * KhanijDrishti — "Intelligence Dark" design system.
 * Token reference lives in docs/design-system.md. Do NOT scatter arbitrary
 * hex values in components — always use these semantic tokens.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Foundations
        background: "rgb(var(--background) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        "surface-2": "rgb(var(--surface-2) / <alpha-value>)", // elevated
        "surface-3": "rgb(var(--surface-3) / <alpha-value>)", // hover / active
        border: {
          DEFAULT: "rgb(var(--border) / <alpha-value>)",
          strong: "rgb(var(--border-strong) / <alpha-value>)",
        },
        // Text
        ink: {
          DEFAULT: "rgb(var(--ink) / <alpha-value>)", // primary
          soft: "rgb(var(--ink-soft) / <alpha-value>)", // secondary
          faint: "rgb(var(--ink-faint) / <alpha-value>)", // muted
        },
        // Accents
        mineral: {
          DEFAULT: "rgb(var(--mineral) / <alpha-value>)", // amber/copper
          soft: "rgb(var(--mineral-soft) / <alpha-value>)",
        },
        data: {
          DEFAULT: "rgb(var(--data) / <alpha-value>)", // muted cyan
          soft: "rgb(var(--data-soft) / <alpha-value>)",
        },
        // Semantic status
        success: "rgb(var(--success) / <alpha-value>)",
        warning: "rgb(var(--warning) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)",
        info: "rgb(var(--info) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "0.875rem" }],
      },
      borderRadius: {
        card: "0.625rem",
      },
      boxShadow: {
        panel: "0 1px 0 0 rgb(var(--border) / 0.6), 0 8px 24px -12px rgba(0,0,0,0.6)",
        elevated: "0 12px 40px -16px rgba(0,0,0,0.8)",
      },
      keyframes: {
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
      },
      animation: {
        shimmer: "shimmer 1.6s infinite",
        "fade-in": "fade-in 0.3s ease-out both",
        "pulse-dot": "pulse-dot 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
