/** @type {import('tailwindcss').Config} */
module.exports = {
  // to make dark mode based on class
  darkMode: "class",
  content: ["./*.html", "./js/*.js"],

  theme: {
    extend: {
      screens: {
        xs: { max: "640px" },
      },
    },
  },
  plugins: [],
};
