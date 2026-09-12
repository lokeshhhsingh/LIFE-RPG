import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#241F1A",
        "ink-muted": "#5B5140",
        parchment: "#EFE2C2",
        "parchment-light": "#F8F1DC",
        "parchment-line": "#D8C79C",
        gold: "#B8863B",
        "gold-bright": "#D3A257",
        forest: "#3F5D45",
        indigo: "#3B4A73",
        rust: "#8C4530",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      borderRadius: {
        card: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
