const {heroui} = require('@heroui/theme');
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/components/tabs.js"
  ],
  theme: {
    extend: {},
  },
  plugins: [heroui()],
}

