/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#545454',
        secondary: '#ffffff',
        tertiary: '#11ccf5',
        quaternary: '#3a7ca5',
        quinary: '#a7e3f4',
      },
    },
  },
  plugins: [],
}