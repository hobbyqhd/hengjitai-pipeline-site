/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./*/index.html",
    "./*/about.html",
    "./*/cases.html",
    "./*/contact.html",
    "./*/news.html",
    "./*/products.html",
    "./*/quality.html",
    "./*/news/published/**/*.html",
    "./templates/**/*.html",
    "./js/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1B3C8C',
        secondary: '#0088CC'
      },
      borderRadius: {
        'none': '0px',
        'sm': '2px',
        DEFAULT: '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
        'full': '9999px',
        'button': '4px'
      }
    }
  },
  plugins: [],
}
