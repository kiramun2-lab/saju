import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        background: '#050516',
        foreground: '#F9F5FF',
        primary: {
          DEFAULT: '#6C4CCF', // deep purple
          dark: '#2B2259'
        },
        accent: {
          gold: '#F5C76B'
        },
        muted: {
          DEFAULT: '#1A1630'
        }
      },
      fontFamily: {
        sans: ["'Pretendard'", 'var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif']
      },
      boxShadow: {
        'glow-gold': '0 0 20px rgba(245, 199, 107, 0.35)',
        'card-soft': '0 18px 40px rgba(0, 0, 0, 0.45)'
      },
      backgroundImage: {
        'cosmic-gradient':
          'radial-gradient(circle at top, rgba(245,199,107,0.12), transparent 55%), radial-gradient(circle at bottom, rgba(108,76,207,0.22), transparent 55%)'
      }
    }
  },
  plugins: []
};

export default config;
