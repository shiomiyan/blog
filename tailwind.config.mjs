/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "'Hiragino Kaku Gothic ProN'",
          "'Hiragino Sans'",
          "Meiryo",
          "sans-serif",
          "'Segoe UI Emoji'"
        ],
        mono: [
          "SFMono-Regular",
          "Consolas",
          "'Liberation Mono'",
          "Menlo",
          "monospace",
          "'Apple Color Emoji'",
          "'Segoe UI Emoji'",
          "'Segoe UI Symbol'",
          "'Noto Color Emoji'"
        ],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
