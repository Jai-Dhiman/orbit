import lynxPreset from "@lynx-js/tailwind-preset";

/** @type {import('tailwindcss').Config} */
export default {
    mode: "jit",
    presets: [lynxPreset],
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    plugins: [],
    theme: {
      colors: {
      },
    },
  };