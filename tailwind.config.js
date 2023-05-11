/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['pages/**/*.{js,jsx,ts,tsx}', 'components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        blue: '#0087C8',
        red: '#D94555',
        green: '#00A175',
        gray: '#A0A4A8',
        orange: '#EA580C',
        lynch: '#607890',
        'grayish-blue': '#34495E',
        secondary: '#7C7C7C',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
