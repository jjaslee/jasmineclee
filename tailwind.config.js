/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'neon-green': '#39FF14',
        'neon-purple': '#6A22FF',
        'brand-green': '#8DFD19',
      },
      boxShadow: {
        neon: '0 0 20px rgba(57, 255, 20, 0.3)',
        'neon-purple': '0 0 20px rgba(106, 34, 255, 0.4)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        bangers: ['Bangers', 'system-ui', 'sans-serif'],
        poppins: ['Poppins', 'system-ui', 'sans-serif'],
        nanum: ['\"Nanum Brush Script\"', 'system-ui', 'cursive'],
      },
    },
  },
  plugins: [],
}

