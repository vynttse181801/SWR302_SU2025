/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f8f8f8',
          100: '#f0f0f0',
          200: '#e4e4e4',
          300: '#d1d1d1',
          400: '#b4b4b4',
          500: '#919191',
          600: '#000000', // Main primary color (now black)
          700: '#2d2d2d',
          800: '#1a1a1a',
          900: '#0a0a0a',
        },
        secondary: {
          500: '#000000', // Accent color (now black)
        },
        gray: {
          50: '#f9f9f9',
          100: '#f4f4f4',
          200: '#e9e9e9',
          300: '#d9d9d9',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
      },
      fontFamily: {
        sans: [
          'Noto Sans',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};