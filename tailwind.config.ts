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
        },
        cshadcn: {
          switchActiveBg: "#f3f3f3",
        },
        shadcn: {
          border: "#2d2d2e",
          input: "#1e1e1e",
          ring: "hsl(var(--ring))",
          background: "#4a4a4a", 
          foreground: "hsl(var(--foreground))",
          primary: {
            DEFAULT: "hsl(var(--primary))",
            foreground: "hsl(var(--primary-foreground))",
          },
          secondary: {
            DEFAULT: "hsl(var(--secondary))",
            foreground: "hsl(var(--secondary-foreground))",
          },
          destructive: {
            DEFAULT: "hsl(var(--destructive))",
            foreground: "hsl(var(--destructive-foreground))",
          },
          muted: {
            DEFAULT: "hsl(var(--muted))",
            foreground: "hsl(var(--muted-foreground))",
          },
          accent: {
            DEFAULT: "#2a2a2a",
            foreground: "hsl(var(--accent-foreground))",
          },
          popover: {
            DEFAULT: "#1e1e1e",
            foreground: "hsl(var(--popover-foreground))",
          },
          card: {
            DEFAULT: "hsl(var(--card))",
            foreground: "hsl(var(--card-foreground))",
          },
        }
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
} satisfies Config;
