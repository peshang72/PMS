/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.html", "./views/**/*.ejs"],
  theme: {
    extend: {
      colors: {
        primary: "#245E9E",
        secondary: "#24409E",
      },
    },
  },
  plugins: [],
};
