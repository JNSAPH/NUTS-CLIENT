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
        clientColors: {
          windowBorder: "#2d2d2e",
          windowBackground: "#252526",
          card: {
            background: "#1e1e1e",
            border: "#2d2d2e",
          },
          scrollbarThumb: {
            base: "#fff",
            hover: "#4a4a4a",
            active: "#4a4a4a",
          },
          button: {
            background: "#1e1e1e",
            hover: "#4a4a4a",
            active: "#4a4a4a",
          },
          windowSpecfic: {
            titleBarCloseBtn: "#00000000",
            titleBarCloseBtnHover: "#e81123",
            titleBarCloseBtnActive: "#c42b1c",
            titleBarOtherBtn: "#00000000",
            titleBarOtherBtnHover: "#64D5EA",
            titleBarOtherBtnActive: "#64D5EA",
          },
          accentColor: "#64D5EA",
          brand: {
            red: "#FF7780",
          }
        }
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
} satisfies Config;
