const config = {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {
      colors: {
        neutral: {
          50: '#444444',
          100: '#404040',
          200: '#3c3c3c',
          300: '#393939',
          400: '#353535',
          500: '#313131',
          600: '#2d2d2d',
          700: '#2a2a2a',
          800: '#262626',
          900: '#222222',
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
