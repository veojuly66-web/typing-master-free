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
        bg: 'var(--bg)',
        surface: {
          DEFAULT: 'var(--surface)',
          2: 'var(--surface-2)',
        },
        border: 'var(--border)',
        text: {
          DEFAULT: 'var(--text)',
          muted: 'var(--muted)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          soft: 'var(--accent-soft)',
        },
        pro: {
          DEFAULT: 'var(--pro)',
          soft: 'var(--pro-soft)',
        },
        error: 'var(--error)',
        warning: 'var(--warning)',

        // Pastel finger guide colors (never neon)
        finger: {
          pinky: 'var(--finger-pinky)',
          ring: 'var(--finger-ring)',
          middle: 'var(--finger-middle)',
          indexL: 'var(--finger-index-l)',
          indexR: 'var(--finger-index-r)',
          thumb: 'var(--finger-thumb)',
        }
      },
      fontSize: {
        '2xs': ['11px', { lineHeight: '14px' }],
        xs: ['13px', { lineHeight: '18px' }],
        sm: ['14px', { lineHeight: '20px' }],
        base: ['16px', { lineHeight: '24px' }],
        lg: ['18px', { lineHeight: '26px' }],
        xl: ['22px', { lineHeight: '30px' }],
        '2xl': ['28px', { lineHeight: '36px' }],
        '3xl': ['36px', { lineHeight: '44px' }],
        '4xl': ['48px', { lineHeight: '56px' }],
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        hindi: ['"Noto Sans Devanagari"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
      },
      borderRadius: {
        btn: '6px',
        input: '6px',
        card: '10px',
        modal: '14px',
      },
      boxShadow: {
        subtle: '0 1px 2px rgba(0, 0, 0, 0.06), 0 1px 1px rgba(0, 0, 0, 0.04)',
        modal: '0 12px 32px rgba(0, 0, 0, 0.12)',
      },
      maxWidth: {
        content: '1120px',
        typing: '860px',
      },
      transitionDuration: {
        DEFAULT: '150ms',
        fast: '120ms',
      }
    },
  },
  plugins: [],
}
