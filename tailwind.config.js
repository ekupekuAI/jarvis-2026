/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Deep space base
        space: {
          950: '#04070d',
          900: '#070b14',
          850: '#0a0f1a',
          800: '#0d1320',
          700: '#121a2c',
          600: '#1a2540',
          500: '#243352',
        },
        // Cyan accent
        accent: {
          50: '#e6fbff',
          100: '#c2f5ff',
          200: '#8aebff',
          300: '#45dcff',
          400: '#16c7f5',
          500: '#0aa6d8',
          600: '#0884b0',
          700: '#0a6a8f',
          800: '#0d5675',
          900: '#0e455e',
        },
        // Secondary blue
        blue: {
          400: '#5b8dff',
          500: '#3b6fe0',
          600: '#2a55c0',
        },
        // Semantic
        success: '#2dd4bf',
        warning: '#fbbf24',
        danger: '#f87171',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'glow-sm': '0 0 12px rgba(22, 199, 245, 0.35)',
        glow: '0 0 24px rgba(22, 199, 245, 0.4)',
        'glow-lg': '0 0 48px rgba(22, 199, 245, 0.45)',
        'glow-soft': '0 0 80px rgba(22, 199, 245, 0.15)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'spin-reverse': 'spin-reverse 12s linear infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'fade-in': 'fade-in 0.4s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        'spin-reverse': {
          '0%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.04)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
