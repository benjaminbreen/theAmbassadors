/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./App.tsx",
    "./index.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./context/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        display: ['"Cinzel"', 'serif'],
        mono: ['"Fira Code"', 'monospace'],
      },
      colors: {
        paper: {
          50: '#f9f7f1',
          100: '#f2efe6',
          200: '#e6e0d2',
          800: '#5c5546',
          900: '#3d382e',
        },
        ink: {
          400: '#4a5568',
          500: '#718096',
          600: '#4a5568',
          700: '#2d3748',
          800: '#1a202c',
          900: '#1a202c',
          950: '#0f1419',
        },
        gold: {
          400: '#d4af37',
          500: '#c5a028',
          600: '#b08d1e',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
        'elevator': 'elevator 5s linear infinite',
        'ping': 'ping 1s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shake: {
          '10%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%': { transform: 'translate3d(2px, 0, 0)' },
          '30%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%': { transform: 'translate3d(4px, 0, 0)' },
          '50%': { transform: 'translate3d(-4px, 0, 0)' },
          '60%': { transform: 'translate3d(4px, 0, 0)' },
          '70%': { transform: 'translate3d(-4px, 0, 0)' },
          '80%': { transform: 'translate3d(2px, 0, 0)' },
          '90%': { transform: 'translate3d(-1px, 0, 0)' },
        },
        elevator: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100%)' }
        },
        ping: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(1.5)', opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}
