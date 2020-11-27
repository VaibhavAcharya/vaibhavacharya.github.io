const colors = require('tailwindcss/colors')

module.exports = {
  purge: [],
  darkMode: 'media',
  theme: {
    colors: { ...colors },
    extend: {},
  },
  variants: {
    extend: {
      backgroundColor: ['focus-visible']
    },
  },
  plugins: [],
}
