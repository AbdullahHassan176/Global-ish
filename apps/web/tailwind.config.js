/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "../../packages/ui/src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Company Brand Colors
        brand: {
          orange: '#FB8465',      // Primary brand orange
          cyan: '#84FCFC',        // Light cyan accent
          teal: '#046C75',        // Dark teal
          purple: '#A85986',       // Purple accent
          pink: '#D4A4BC',        // Light pink
          magenta: '#9C4474',      // Dark magenta
          cream: '#FDEDD8',        // Light cream background
          navy: '#112552',         // Dark navy blue
        },
        // Semantic color mapping
        primary: {
          50: '#FDEDD8',          // cream
          100: '#D4A4BC',         // light pink
          200: '#FB8465',         // brand orange
          300: '#84FCFC',         // light cyan
          400: '#A85986',         // purple
          500: '#9C4474',         // magenta
          600: '#046C75',         // teal
          700: '#112552',         // navy
          800: '#0A1A3A',         // darker navy
          900: '#051122',         // darkest navy
        },
        // Additional brand variations
        accent: {
          orange: '#FB8465',
          cyan: '#84FCFC',
          teal: '#046C75',
          purple: '#A85986',
          pink: '#D4A4BC',
          magenta: '#9C4474',
        },
        background: {
          cream: '#FDEDD8',
          navy: '#112552',
        }
      },
    },
  },
  plugins: [],
}
