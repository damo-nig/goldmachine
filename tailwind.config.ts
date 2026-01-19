import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#FFD447',
          light: '#FFE55C',
          dark: '#CBA000',
          border: '#8B7500',
        },
        dark: {
          DEFAULT: '#0a0a0a',
          light: '#1a1a1a',
          medium: '#111111',
        },
      },
      fontFamily: {
        vt323: ['var(--font-vt323)', 'VT323', 'monospace'],
      },
      boxShadow: {
        'gold-glow': '0 0 20px rgba(255, 212, 71, 0.4)',
        'gold-glow-lg': '0 0 60px rgba(255, 212, 71, 0.4)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'shovel-glow': 'shovelGlow 0.8s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '1' },
        },
        shovelGlow: {
          '0%, 100%': { 
            filter: 'drop-shadow(0 0 0px rgba(255, 215, 0, 0))',
            transform: 'scale(1)',
          },
          '50%': { 
            filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.8))',
            transform: 'scale(1.25)',
          },
        },
      },
    },
  },
  plugins: [],
}

export default config
