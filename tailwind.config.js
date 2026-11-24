/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        tm: {
          dark: '#0f172a',
          card: '#1e293b',
          border: '#334155',
          accent: '#06b6d4',
          gold: '#f59e0b',
          correct: '#10b981',
          error: '#ef4444',
          pinky: '#f43f5e',
          ring: '#f97316',
          middle: '#10b981',
          indexL: '#3b82f6',
          indexR: '#8b5cf6',
          thumb: '#64748b'
        }
      },
      animation: {
        'bounce-short': 'bounce 0.5s ease-in-out 1',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
