/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Ponte AI Color Scheme
        ponte: {
          background: '#09090b', // rgb(9, 9, 11) - very dark gray/black
          text: '#fafafa', // rgb(250, 250, 250) - off-white
          accent: '#dd3c61', // rgb(221, 60, 97) - bright pink
          secondary: '#27272a', // rgb(39, 39, 42) - medium gray
          yellow: '#facc15', // rgb(250, 204, 21) - golden yellow
          lightGray: '#a1a1aa', // rgb(161, 161, 170) - light gray
          // Additional variations
          backgroundLight: 'rgba(9, 9, 11, 0.6)',
          backgroundLighter: 'rgba(9, 9, 11, 0.4)',
          textMuted: 'rgba(250, 250, 250, 0.8)',
          textLight: 'rgba(250, 250, 250, 0.6)',
          accentLight: 'rgba(221, 60, 97, 0.2)',
          accentDark: 'rgba(221, 60, 97, 0.9)',
          border: 'rgba(255, 255, 255, 0.1)',
          borderLight: 'rgba(255, 255, 255, 0.2)',
        },
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        purple: {
          500: '#8b5cf6',
          600: '#7c3aed',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}