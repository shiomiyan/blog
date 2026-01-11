/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji"'],
        mono: ['ui-monospace,SFMono-Regular,Consolas,Menlo,Monaco,Liberation Mono,Courier New,Droid Sans Mono,monospace'],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            "--tw-prose-body": "#000",
            "ul > li": {
              lineHeight: "1.4",
            },
            "ol > li": {
              lineHeight: "1.4",
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
