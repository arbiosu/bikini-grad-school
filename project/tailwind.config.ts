import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

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
      textShadow: {
        'chonk': `-2px -2px 0 #000,
                  2px -2px 0 #000,
                  -2px 2px 0 #000,
                  2px 2px 0 #000,
                  -12px 12px 0 #000`
      },
      lineHeight: {
        'chonk': '0.91'
      }
    },
  },
  plugins: [
    plugin(({ addUtilities, theme }) => {
      const textShadows = theme('textShadow') as Record<string, string>;
      const newUtilities: Record<string, Record<string, string>> = {};
      
      Object.entries(textShadows).forEach(([key, value]) => {
        newUtilities[`.text-shadow-${key}`] = {
          textShadow: value,
        };
      });
      
      addUtilities(newUtilities);
    }),
  ],
} satisfies Config;
