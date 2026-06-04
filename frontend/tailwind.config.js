/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'mfg-base':    '#070B14',
        'mfg-surface': '#0D1424',
        'mfg-card':    '#0F1A2E',
        'mfg-elevated':'#111827',
        'mfg-hover':   '#162035',
        'mfg-border':  '#1E2D47',
        'accent':      '#3B82F6',
        'accent-bright':'#60A5FA',
        'accent-dim':  '#1D4ED8',
      },
      fontFamily: {
        sans:  ['Inter', 'sans-serif'],
        syne:  ['Syne', 'sans-serif'],
        grotesk: ['Space Grotesk', 'sans-serif'],
        mono:  ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'shimmer':    'shimmer 1.5s infinite',
        'fade-in':    'fadeIn 0.4s ease forwards',
        'slide-up':   'slideUp 0.4s ease forwards',
      },
      keyframes: {
        fadeIn:   { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp:  { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        shimmer:  { '0%': { backgroundPosition: '200% 0' }, '100%': { backgroundPosition: '-200% 0' } },
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(59,130,246,0.25)',
        'glow-sm':   '0 0 10px rgba(59,130,246,0.15)',
        'card':      '0 4px 24px rgba(0,0,0,0.35)',
      },
    },
  },
  plugins: [],
}
