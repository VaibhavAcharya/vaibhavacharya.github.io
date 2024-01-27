const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["index.html"],
  theme: {
    extend: {
      fontFamily: {
        sans: [`"Work Sans"`, ...defaultTheme.fontFamily.sans],
        handjet: ["Handjet", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        bhagwa: {
          DEFAULT: "hsl(27, 100%, 50%)",
        },
      },
    },
  },
  plugins: [],
  future: {
    hoverOnlyWhenSupported: true,
  },
};
