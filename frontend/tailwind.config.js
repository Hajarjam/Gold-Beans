/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "instrument-serif": ["Instrument Serif", ...defaultTheme.fontFamily.serif],
        "instrument-sans": ["Instrument Sans", ...defaultTheme.fontFamily.sans],
        robotoSerif: ["Roboto Serif", ...defaultTheme.fontFamily.serif],
      },
      colors: {
        peach: "#E6C7B3",
        "peach-light": "#FFF3EB",
        "dark-brown": "#77523C",
        charcoal: "#1B1515",
        brown: "#3B170D",
      },
    },
  },
  plugins: [],
};
