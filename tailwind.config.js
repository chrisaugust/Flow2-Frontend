/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#E6F4EA',   // very light green
          DEFAULT: '#A8D5BA', // soft green
          dark: '#6BA58E',    // muted green
        },
        sky: {
          light: '#E0F2F7',   // pale blue
          DEFAULT: '#90C7E3', // soft blue
          dark: '#4A90B5',    // muted blue
        },
        slate: {
          50: '#F8F9FA',      // very light grey
          100: '#EDEEF1',
          200: '#D4D6DB',
          300: '#B9BCC3',
          400: '#9EA3AB',
          500: '#848B95',      // default grey
          600: '#6A7280',
          700: '#505867',
          800: '#363D4D',
          900: '#1E2231',      // darkest grey
        },
        accent: '#F4A261',     // soft muted orange for highlights/buttons
      },
    },
  },
  plugins: [],
};