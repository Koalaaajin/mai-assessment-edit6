/*
 * PostCSS configuration for Vite. This file registers the Tailwind and
 * Autoprefixer plugins so that your CSS is processed correctly when
 * building the project. See https://tailwindcss.com/docs/installation for
 * more information.
 */
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};