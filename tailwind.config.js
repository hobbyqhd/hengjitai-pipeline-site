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
        primary: {
          DEFAULT: '#162d52',
          dark: '#0f1f38',
          muted: '#2a4570'
        },
        secondary: {
          DEFAULT: '#1ba8d8',
          dark: '#1382a8'
        },
        surface: '#f1f5f9',
        footer: '#0c1628'
      },
      boxShadow: {
        header:
          '0 1px 0 0 rgb(15 23 42 / 0.06), 0 8px 24px -12px rgb(15 23 42 / 0.12)',
        card: '0 4px 24px -6px rgb(15 23 42 / 0.08), 0 0 0 1px rgb(15 23 42 / 0.04)'
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
