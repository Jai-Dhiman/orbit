const { hairlineWidth } = require('nativewind/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './node_modules/@rnr/**/*.{ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        sans: ['WorkSans-Regular'],
        'sans-thin': ['WorkSans-Thin'],
        'sans-extralight': ['WorkSans-ExtraLight'],
        'sans-light': ['WorkSans-Light'],
        'sans-medium': ['WorkSans-Medium'],
        'sans-semibold': ['WorkSans-SemiBold'],
        'sans-bold': ['WorkSans-Bold'],
        'sans-extrabold': ['WorkSans-ExtraBold'],
        'sans-black': ['WorkSans-Black'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          solid: '#7D6E83',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
          solid: '#94B49F',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
          solid: '#F1EDE4',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
          solid: '#D7A86E',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        neutral: {
          white: '#FFFCF5',
          light: '#F9F7F2',
          gray: '#E8E2D6',
        },
        rustic: {
          // Light mode colors
          background: '#F9F7F2',
          surface: '#FFFCF5',
          textPrimary: '#4A4238',
          textSecondary: '#7D7468',
          border: '#E8E2D6',
          muted: '#F1EDE4',
          
          // Dark mode colors
          darkBackground: '#2C2922',
          darkSurface: '#35312A',
          darkPrimary: '#A99F92',
          darkSecondary: '#A7BC9F',
          darkAccent: '#C89F65',
          darkTextPrimary: '#E8E2D6',
          darkTextSecondary: '#BDB5A7',
          darkBorder: '#4F4A40',
          darkMuted: '#403B33',
          
          // Utility colors
          success: '#B5C9A5',
          darkSuccess: '#8DAB80',
          warning: '#E6C99A',
          darkWarning: '#D4B483',
          error: '#D9A295',
          darkError: '#C47C6D',
        },
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
