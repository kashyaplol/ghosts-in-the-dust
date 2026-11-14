/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'space-black': '#07080b',
        'panel-dark': '#0d1015',
        'panel-recessed': '#13171f',
        'panel-elevated': '#191f2a',
        'glass-border': 'rgba(226, 232, 240, 0.12)',
        'ink-primary': '#f2efe9',
        'ink-secondary': '#a6b0be',
        'ink-muted': '#6e7887',
        'ice-accent': '#67c5d9',
        'mars-copper': '#c96a42',
        'lunar-silver': '#c8d0dc',
        'solar-amber': '#d49a45',
        'alert-red': '#d45b5b',
      },
      opacity: {
        6: '0.06',
        7: '0.07',
        8: '0.08',
        12: '0.12',
        18: '0.18',
        82: '0.82',
        92: '0.92',
        94: '0.94',
      },
      fontFamily: {
        display: [
          'Palatino Linotype',
          'Book Antiqua',
          'Georgia',
          'Liberation Serif',
          'serif',
        ],
        sans: [
          'Noto Sans',
          'Segoe UI',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Consolas',
          'monospace',
        ],
      },
    },
  },
  plugins: [],
};
