/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        primary: "#3B82F6",
        secondary: "#6B7280",
      },
      borderRadius: {
        xl: "1rem",
      },
      boxShadow: {
        soft: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [],
};

// export default {
//   theme: {
//     extend: {

//     },
//   },
//   // si tu utilises content:
//   content: [
//     './index.html',
//     './src/**/*.{vue,js,ts,jsx,tsx}',
//   ],
// };
