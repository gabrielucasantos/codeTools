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
        'dark-bg': '#0a0a0a',
        'dark-surface': '#1a1a1a',
        'dark-border': '#2a2a2a',
        'neon-primary': '#00ff9d',
        'neon-secondary': '#00ff9d',
        'neon-accent': '#00ff9d',
        'light-bg': '#f8f9fa',
        'light-surface': '#ffffff',
        'light-border': '#e9ecef',
        'light-text': {
          primary: '#495057',
          secondary: '#6c757d',
        },
        'vibrant-primary': '#00ff9d',
        'vibrant-secondary': '#00ff9d',
        'vibrant-accent': '#00ff9d'
      },
      boxShadow: {
        'neon': '0 0 5px theme(colors.neon-primary), 0 0 20px theme(colors.neon-primary)',
        'vibrant': '0 0 15px theme(colors.vibrant-primary)',
        'modern': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
      },
      scale: {
        '102': '1.02'
      }
    }
  },
  plugins: []
}