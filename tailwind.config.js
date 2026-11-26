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
        ink: {
          DEFAULT: 'var(--text)',
          muted: 'var(--text-muted)',
        },
        paper: {
          DEFAULT: 'var(--bg)',
          surface: 'var(--surface)',
          border: 'var(--border)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          soft: 'var(--accent-soft)',
        },
        type: {
          correct: 'var(--color-correct)',
          error: 'var(--color-error)',
          caret: 'var(--color-caret)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
      },
      borderRadius: {
        card: '8px',
        btn: '6px',
      },
      boxShadow: {
        subtle: '0 1px 2px rgba(0, 0, 0, 0.06)',
      },
      maxWidth: {
        content: '1120px',
      }
    },
  },
  plugins: [],
}