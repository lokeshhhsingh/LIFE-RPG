import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Teammate (UI/UX) owns theme tokens here — colors, fonts, spacing scale
      // for whatever visual direction (retro dungeon / cyberpunk / cozy lo-fi) gets picked.
      colors: {},
      fontFamily: {},
    },
  },
  plugins: [],
};

export default config;
