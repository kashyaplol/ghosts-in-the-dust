/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'space-black': '#08090c',
        'panel-dark': '#12141d',
        'glass-border': 'rgba(255, 255, 255, 0.1)',
        'neon-cyan': '#00f3ff',
        'solar-amber': '#ffb703',
        'alert-red': '#ff4d4d',
      },
    },
  },
  plugins: [],
};

