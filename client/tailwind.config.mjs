// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6', // accent actions
        secondary: '#6366f1', // secondary CTAs or toggles
        muted: '#f8fafc', // soft backgrounds
        dark: '#0f172a', // dark mode base
        border: '#e5e7eb', // consistent border color
        danger: '#ef4444', // destructive actions
        success: '#10b981', // confirmations
        warning: '#f59e0b', // cautions
        accent: '#d946ef', // optional highlight
      },
      fontFamily: {
        sans: ['Karla', 'ui-sans-serif', 'system-ui'],
        mono: ['Inconsolata', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        subtle: '0 1px 2px rgba(0, 0, 0, 0.05)',
        hover: '0 2px 6px rgba(0, 0, 0, 0.08)',
        deep: '0 4px 12px rgba(0, 0, 0, 0.12)',
      },
      spacing: {
        'header-height': '4rem',
        'card-padding': '1.5rem',
        container: '2rem',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.800'),
            a: { color: theme('colors.primary'), fontWeight: '600' },
            strong: { fontWeight: '600' },
            code: { color: theme('colors.pink.600') },
          },
        },
        dark: {
          css: {
            color: theme('colors.gray.100'),
            a: { color: theme('colors.primary') },
            strong: { color: theme('colors.white') },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('tailwindcss-animate'),
  ],
};
