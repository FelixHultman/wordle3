/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './public/**/*.{html,js,handlebars}',
    './views/**/*.{html,js,handlebars}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
