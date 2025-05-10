/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        background: 'var(--color-background)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-tertiary': 'var(--color-text-tertiary)',
        surface: 'var(--color-surface)',
        border: 'var(--color-border)',
        error: 'var(--color-error)',
        'primary-light': 'var(--color-primary-light)',
        'primary-dark': 'var(--color-primary-dark)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '4xl': '4rem',
        '3xl': '3rem',
        '2xl': '2rem',
        xl: '1.5rem',
        lg: '1rem',
        md: '0.75rem',
        sm: '0.5rem',
        xs: '0.25rem',
      },
      borderRadius: {
        xl: '1rem',
        lg: '0.5rem',
        md: '0.25rem',
      },
      boxShadow: {
        xl: '0 4px 16px rgba(37,99,235,0.10)',
        lg: '0 2px 8px rgba(0,0,0,0.04)',
        md: '0 1px 3px rgba(0,0,0,0.1)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    function({ addUtilities, matchUtilities, theme }) {
      addUtilities({
        '.bg-gradient-radial': {
          'background-image': 'radial-gradient(var(--tw-gradient-stops))',
        },
        '.bg-gradient-radial-at-t': {
          'background-image': 'radial-gradient(at top, var(--tw-gradient-stops))',
        },
        '.bg-gradient-radial-at-b': {
          'background-image': 'radial-gradient(at bottom, var(--tw-gradient-stops))',
        },
        '.bg-gradient-radial-at-l': {
          'background-image': 'radial-gradient(at left, var(--tw-gradient-stops))',
        },
        '.bg-gradient-radial-at-r': {
          'background-image': 'radial-gradient(at right, var(--tw-gradient-stops))',
        },
        '.bg-gradient-radial-at-c': {
          'background-image': 'radial-gradient(at center, var(--tw-gradient-stops))',
        },
      });
    }
  ],
} 