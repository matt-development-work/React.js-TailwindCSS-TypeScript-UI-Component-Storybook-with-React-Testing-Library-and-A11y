module.exports = {
  purge: ['./src/components/**/*.tsx'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        amber: {
          400: '#fbbf24',
        },
        emerald: {
          600: '#059669',
        },
        lime: {
          400: '#a3e635',
        },
        rose: {
          500: '#f43f5e',
        },
      },
    },
  },
  plugins: [],
  variants: {
    brightness: ['hover'],
  },
};
