/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Isso garante que ele leia os seus componentes
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}