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
        sans: ['"Raleway"', 'sans-serif'],
        display: ['"Cinzel"', 'serif'],
        mono: ['"Fira Code"', 'monospace'],
      },
      colors: {
        // Warm parchment/paper tones - for backgrounds and light surfaces
        paper: {
          50: '#fdfcf9',   // Almost white with warm tint
          100: '#f9f7f1',  // Lightest cream
          200: '#f2efe6',  // Light parchment
          300: '#e6e0d2',  // Warm cream
          400: '#d4cbb8',  // Aged paper
          500: '#b8a98f',  // Darker parchment
          600: '#9a8a6e',  // Weathered paper
          700: '#7d6f56',  // Dark aged paper
          800: '#5c5546',  // Very dark parchment
          900: '#3d382e',  // Near-black warm
        },
        // Cool ink tones - for text and dark UI elements
        ink: {
          50: '#f7f8fa',   // Lightest gray-blue
          100: '#e8eaef',  // Very light ink wash
          200: '#c9cdd6',  // Light gray
          300: '#a0a7b5',  // Medium light gray
          400: '#6b7280',  // Medium gray (good for secondary text)
          500: '#4a5568',  // Standard gray
          600: '#3d4556',  // Darker gray
          700: '#2d3748',  // Dark gray (good for headings)
          800: '#1a202c',  // Very dark (near black)
          900: '#0f1419',  // Deepest ink black
          950: '#080b0f',  // True black with blue tint
        },
        // Rich gold tones - for accents, highlights, luxury elements
        gold: {
          50: '#fffdf0',   // Palest gold tint
          100: '#fff8d6',  // Very light gold
          200: '#ffee96',  // Light gold / pale yellow
          300: '#f2dd6f',  // Soft gold
          400: '#e6c84d',  // Medium gold
          500: '#d4af37',  // Classic gold (primary)
          600: '#b8942a',  // Rich gold
          700: '#96771f',  // Dark gold / antique
          800: '#745b17',  // Bronze gold
          900: '#523f10',  // Darkest gold / brown-gold
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
        'elevator': 'elevator 5s linear infinite',
        'ping': 'ping 1s ease-out forwards',
        // Modal/UI animations
        'slide-up': 'slideUp 0.3s ease-out',
        'expand-width': 'expandWidth 0.2s ease-out forwards',
        'zone-reveal': 'zoneReveal 0.8s ease-out',
        // Portrait animations
        'blink': 'blink 4s ease-in-out infinite',
        'breathe': 'breathe 4s ease-in-out infinite',
        'smoke-flow': 'smokeFlow 3s ease-in-out infinite',
        'ember': 'ember 2s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 1.5s ease-in-out infinite',
        // Effect animations
        'float': 'float 3s ease-in-out infinite',
        'float-embarrassment': 'floatEmbarrassment 3s ease-in-out infinite',
        'float-up': 'floatUp 1s ease-out forwards',
        'fade-slide': 'fadeSlide 0.4s ease-out forwards',
        'shine': 'shine 2s ease-in-out infinite',
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
        },
        // Modal/UI keyframes
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        expandWidth: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        zoneReveal: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        // Portrait keyframes
        blink: {
          '0%, 90%, 100%': { transform: 'scaleY(1)' },
          '95%': { transform: 'scaleY(0.1)' },
        },
        breathe: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(1px)' },
        },
        smokeFlow: {
          '0%, 100%': { opacity: '0.3', transform: 'translateY(0) translateX(0)' },
          '50%': { opacity: '0.6', transform: 'translateY(-5px) translateX(2px)' },
        },
        ember: {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.1)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
        // Effect keyframes
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        floatEmbarrassment: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)', opacity: '0.3' },
          '50%': { transform: 'translateY(-20px) translateX(10px)', opacity: '0.6' },
        },
        floatUp: {
          '0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
          '50%': { opacity: '1', transform: 'translateY(-20px) scale(1.1)' },
          '100%': { opacity: '0', transform: 'translateY(-60px) scale(0.8)' },
        },
        fadeSlide: {
          '0%': { opacity: '0', transform: 'translateY(-5px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shine: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      }
    },
  },
  plugins: [],
}
