/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "quicksand": ["Quicksand", "sans-serif"],
        "ptsans": ["PT Sans", "sans-serif"],
        "ubuntu": ["Ubuntu", "sans-serif"],
      },
      colors: {
        "todo-dark": "#0D0D0D",
        "todo-dark-secondary": "#1E1E1E",
        "todo-green": "#57CB4C",
        "todo-light": "#CEBEA4",
        "todo-red": "#FF5631",
      },
    },
  },
  plugins: [require("daisyui")],
};
