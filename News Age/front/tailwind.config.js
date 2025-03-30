/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'violet': {
          DEFAULT: '#A360A2',
          dark: '#231137',
          darker: '#170126',
          light: '#A284BF',
          blue: '#2F2D73'
        },
        'offwhite': '#F8FAFC'
      },
      fontFamily: {
        'jost': ['Jost', 'sans-serif'],
      },
    },
  },
  plugins: [],
}