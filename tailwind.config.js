const colors = require("tailwindcss/colors");

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        lime: colors.lime,
      },
      keyframes: {
        clickAnimation: {
          "0%, 100%": { transform: "scale(1), translate(0, 0)" },
          "50%": { transform: "scale(0.98) translate(0px, 1px)" },
        },
      },
      animation: {
        clickAnimation: "clickAnimation 0.1s ease-in-out",
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ["active"],
      animation: ["active"],
    },
  },
  plugins: [],
};
