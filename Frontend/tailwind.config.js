/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: {
          dark: '#0f172a', // slate-950
        },
        surface: {
          dark: '#1e293b', // slate-800
        },
        primary: {
          DEFAULT: '#3b82f6', // blue-500
          hover: '#2563eb',   // blue-600
        },
        accent: {
          teal: '#14b8a6',    // teal-500
          pink: '#ec4899',    // pink-500
        }
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
}
