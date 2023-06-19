/** @type {import('tailwindcss').Config} */

import defaultTheme from 'tailwindcss/defaultTheme';
import colors from 'tailwindcss/colors';


export default {
  darkMode: "class",
  content: ["./src/**/*.{html,js,ts,tsx,css}","./index.html"],
  theme: {
    colors: {
      accent: '#4f67bc',
      accentDark: '#4f67bc',
      ...colors,
    },
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
        clock: ['Varela Round', 'serif'],
      },
    },
  },
  plugins: [],
}
