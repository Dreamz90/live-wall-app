/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Scans all your React files for styles
  ],
  theme: {
    extend: {
      colors: {
        // Defining your custom Islamic Floral palette
        'ceremony-gold': '#C5A059',
        'ceremony-green': '#2C5E1A',
        'ceremony-cream': '#FDFBF0',
      },
      fontFamily: {
        // Matching the fonts we added to index.html
        serif: ['Playfair Display', 'serif'],
        arabic: ['Lateef', 'cursive'],
      },
    },
  },
  plugins: [],
}