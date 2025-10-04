import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			orbit: {
  				background: '#0E0E0F',
				marine: '#4468F2',
				sideBar: '#1A1A1B',
				window: {
					btnClose: '#E81123',
					btnCloseHover: '#C42B1C',
					btnCloseActive: '#9A1C14',
					btnHover: '#3A3A3C',
				}
  			},
  			clientColors: {
  				windowBorder: '#2d2d2e',
  				windowBackground: '#252526',
  				card: {
  					background: '#1e1e1e',
  					border: '#2d2d2e'
  				},
  				scrollbarThumb: {
  					base: '#fff',
  					hover: '#4a4a4a',
  					active: '#4a4a4a'
  				},
  				button: {
  					background: '#1e1e1e',
  					hover: '#4a4a4a',
  					active: '#4a4a4a'
  				},
  				windowSpecfic: {
  					titleBarCloseBtn: '#00000000',
  					titleBarCloseBtnHover: '#e81123',
  					titleBarCloseBtnActive: '#c42b1c',
  					titleBarOtherBtn: '#00000000',
  					titleBarOtherBtnHover: '#64D5EA',
  					titleBarOtherBtnActive: '#64D5EA'
  				},
  				accentColor: '#64D5EA',
  				brand: {
  					red: '#FF7780'
  				}
  			},
  			cshadcn: {
  				switchActiveBg: '#f3f3f3'
  			},
  			shadcn: {
  				border: '#2d2d2e',
  				input: '#1e1e1e',
  				ring: 'hsl(var(--ring))',
  				background: '#4a4a4a',
  				foreground: 'hsl(var(--foreground))',
  				primary: {
  					DEFAULT: 'hsl(var(--primary))',
  					foreground: 'hsl(var(--primary-foreground))'
  				},
  				secondary: {
  					DEFAULT: 'hsl(var(--secondary))',
  					foreground: 'hsl(var(--secondary-foreground))'
  				},
  				destructive: {
  					DEFAULT: 'hsl(var(--destructive))',
  					foreground: 'hsl(var(--destructive-foreground))'
  				},
  				muted: {
  					DEFAULT: 'hsl(var(--muted))',
  					foreground: 'hsl(var(--muted-foreground))'
  				},
  				accent: {
  					DEFAULT: '#2a2a2a',
  					foreground: 'hsl(var(--accent-foreground))'
  				},
  				popover: {
  					DEFAULT: '#1e1e1e',
  					foreground: 'hsl(var(--popover-foreground))'
  				},
  				card: {
  					DEFAULT: 'hsl(var(--card))',
  					foreground: 'hsl(var(--card-foreground))'
  				}
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [
    require('tailwind-scrollbar'),
      require("tailwindcss-animate")
],
} satisfies Config;
