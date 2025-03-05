// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xs: '400px',
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1281px',
      xxl: '1536px',
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
