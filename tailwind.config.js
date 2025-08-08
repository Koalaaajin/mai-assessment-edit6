/**
 * @type {import('tailwindcss').Config}
 *
 * Tailwind CSS configuration for the MAI survey application. This file
 * defines which files Tailwind should scan for class names and
 * provides a hook for future customizations. Feel free to extend the
 * theme or add plugins as the project grows. See
 * https://tailwindcss.com/docs/configuration for more details.
 */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};