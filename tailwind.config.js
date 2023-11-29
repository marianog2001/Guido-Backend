/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "src/views/layouts/main.handlebars",
    "src/views/*.handlebars",
    "src/views/*.html"
  ],
  theme: {
    extend: {
      colors:{
        'main-1':'#F8F0E5',
        'main-2':'#EADBC8',
        'main-3':'#DAC0A3',
        'main-4':'#86A3B8'
      }
    },
  },
  plugins: [],
}

