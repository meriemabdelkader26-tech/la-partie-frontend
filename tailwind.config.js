/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx,js,jsx,mdx}",
    "./src/components/**/*.{ts,tsx,js,jsx,mdx}",
    "./src/pages/**/*.{ts,tsx,js,jsx,mdx}",
    "./src/**/*.{ts,tsx,js,jsx,mdx}",
    "./components.json"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "Raleway", "ui-sans-serif", "system-ui"],
      },
      colors: {
        mainColor: "#2f365f",
        background: "#f7f1ed",
        foreground: "#2f365f",
        card: "#ffffff",
        "card-foreground": "#2f365f",
        popover: "#ffffff",
        "popover-foreground": "#2f365f",
        primary: "#2f365f",
        "primary-foreground": "#f7f1ed",
        secondary: "#e7ddda",
        "secondary-foreground": "#2f365f",
      },
      borderRadius: {
        DEFAULT: "0.625rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
