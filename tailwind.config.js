const colors = require('tailwindcss/colors')

module.exports = {
  purge: {
    content: [
    './pages/**/*.js',
    './components/**/*.js',
  ]
},
  darkMode: 'media',
  theme: {
    colors: { ...colors },
    extend: {},
  },
  variants: {
    extend: {
      backgroundColor: ['focus-visible'],
      scale: ['focus-visible']
    },
  },
  plugins: [],
}
