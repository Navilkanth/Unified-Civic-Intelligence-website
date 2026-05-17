/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        civic: {
          navy:  '#0b1f3b',
          teal:  '#0d6b76',
          gold:  '#c9a227',
          mist:  '#e8eef5',
        }
      },
      fontFamily: {
        display: ['"Newsreader"', 'serif'],
        sans:    ['"DM Sans"', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
