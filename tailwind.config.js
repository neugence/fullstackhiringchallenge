/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#141414',
        sand: '#f8f4ea',
        ember: '#da4b24',
      },
      boxShadow: {
        card: '0 20px 40px -28px rgba(20, 20, 20, 0.5)',
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
