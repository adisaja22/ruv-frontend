/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#EFC075',
          light: 'rgba(239, 192, 117, 0.2)', // 20% bg for badge
          dark: '#d6a658',
        },
        secondary: {
          DEFAULT: '#75D7F1',
          light: 'rgba(117, 215, 241, 0.2)', // 20% bg for badge
          dark: '#58bcd5',
        },
        neutral: {
          900: '#1A1A1A',
          700: '#4A4A4A',
          400: '#9B9B9B',
          200: '#E5E5E5',
          100: '#F7F5F2',
        },
        success: '#3FB27F',
        warning: '#F2B84B',
        error: '#E5484D',
      },
      fontFamily: {
        heading: ['Poppins', 'Segoe UI', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 8px rgba(0,0,0,0.06)',
        hover: '0 8px 16px rgba(0,0,0,0.1)',
      },
      borderRadius: {
        'card': '12px',
        'modal': '16px',
      },
      screens: {
        'mobile-max': { 'max': '480px' },
        'tablet': '481px',
        'desktop': '1025px',
        'large': '1441px',
      }
    },
  },
  plugins: [],
}

