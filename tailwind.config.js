const colors = require('tailwindcss/colors')

module.exports = {
  purge: [
    './pages/**/*',
    './components/**/*',
  ],
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
