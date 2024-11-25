/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji"'],
        mono: ['ui-monospace,SFMono-Regular,Consolas,Menlo,Monaco,Liberation Mono,Courier New,monospace'],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
