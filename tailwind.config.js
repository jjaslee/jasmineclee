/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          500: '#6A22FF',
          600: '#6A22FF',
        },
        'neon-green': '#39FF14',
        'neon-purple': '#6A22FF',
        'accent-blue': '#38BDF8',
        'accent-yellow': '#FBBF24',
        'accent-red': '#F87171',
        'brand-green': '#8DFD19',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'neon': '0 0 20px rgba(57, 255, 20, 0.3)',
        'neon-purple': '0 0 20px rgba(106, 34, 255, 0.4)',
      },
    },
  },
  plugins: [],
}
