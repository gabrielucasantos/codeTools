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
        'neon-secondary': '#00b8ff',
        'neon-accent': '#ff00ff',
        'light-bg': '#ffffff',
        'light-surface': '#f8f8f8',
        'light-border': '#e0e0e0',
        'vibrant-primary': '#6366f1',
        'vibrant-secondary': '#8b5cf6',
        'vibrant-accent': '#ec4899'
      },
      boxShadow: {
        'neon': '0 0 5px theme(colors.neon-primary), 0 0 20px theme(colors.neon-primary)',
        'vibrant': '0 0 15px theme(colors.vibrant-primary)'
      },
      scale: {
        '102': '1.02'
      }
    }
  },
  plugins: []
}