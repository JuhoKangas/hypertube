/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'dark-red': '#AF0404',
        'black': '#252525',
        'gray': '#414141',
        'light-red': '#FF0000',
      },
      backgroundImage: {
        'landing-bg': "url('../public/landing-bg.jpg')",
      },
    },
    fontFamily: {
      montserrat: ['Montserrat', 'sans-serif'],
    },
  },
  plugins: [],
}
