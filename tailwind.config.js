module.exports = {
  purge: ['./src/components/**/*.tsx'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  variants: {
    brightness: ['hover'],
  },
};
