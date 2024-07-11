import defaultTheme from "tailwindcss/defaultTheme";
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["BIZ UDPGothic", ...defaultTheme.fontFamily.sans],
        mono: [["Fira Code Variable", ...defaultTheme.fontFamily.mono], {
          fontFeatureSettings: '"liga" 0',
          fontVariationSettings: 'normal',
        }],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
