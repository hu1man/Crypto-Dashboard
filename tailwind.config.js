/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#121212',
        accent: '#00ff99',
        orange: '#ff9900',
      },
      borderRadius: {
        '2xl': '1rem',
        'lg': '0.5rem',
      },
      boxShadow: {
        smooth: '0 4px 24px rgba(0,0,0,0.2)',
      },
    },
  },
  plugins: [],
}

