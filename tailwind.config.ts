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
          gold: '#94a3b8' // 회색 톤 (기존 gold 대신)
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
        'glow-gold': '0 0 20px rgba(148, 163, 184, 0.2)',
        'card-soft': '0 18px 40px rgba(0, 0, 0, 0.45)'
      },
      backgroundImage: {
        'cosmic-gradient':
          'radial-gradient(circle at top, rgba(148,163,184,0.08), transparent 55%), radial-gradient(circle at bottom, rgba(148,163,184,0.06), transparent 55%)'
      }
    }
  },
  plugins: []
};

export default config;
