/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        excel: {
          green: '#107c41',
          darkgreen: '#0b5a2f',
          lightgreen: '#e8f5e9',
          border: '#d4d4d4',
          header: '#f3f4f6',
          active: '#107c41',
          cell: '#ffffff',
        }
      },
      fontFamily: {
        excel: ['Segoe UI', 'Calibri', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
