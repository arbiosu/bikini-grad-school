import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "custom-pink-bg": "#F6C1D8",
        "custom-pink-text": "#B44B59",
        "bgs-pink": "#F6C1D8",
      },
    },
  },
  plugins: [],
} satisfies Config;
