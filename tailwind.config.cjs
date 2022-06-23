const config = {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {
      colors: {
        neutral: {
          50: '#404245',
          100: '#3c3e41',
          200: '#393b3d',
          300: '#35373a',
          400: '#323336',
          500: '#2e3032',
          600: '#2b2c2e',
          700: '#27282b',
          800: '#242527',
          900: '#202123',
        },
      },
    },
    fontFamily: {
      sans: ['Noto Sans', 'sans-serif'],
    },
  },

  plugins: [],
};

module.exports = config;
