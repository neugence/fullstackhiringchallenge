/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f7fa',
          100: '#ebeef3',
          200: '#d2dae5',
          300: '#aab9cf',
          400: '#7c94b6',
          500: '#5a759f',
          600: '#475e85',
          700: '#3a4d6c',
          800: '#33425b',
          900: '#2d394d',
        },
      },
    },
  },
  plugins: [],
}
