/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
    'node_modules/primevue/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'primary-50': 'var(--p-primary-50)',
        'primary-100': 'var(--p-primary-100)',
        'primary-200': 'var(--p-primary-200)',
        'primary-300': 'var(--p-primary-300)',
        'primary-400': 'var(--p-primary-400)',
        'primary-500': 'var(--p-primary-500)',
        'primary-600': 'var(--p-primary-600)',
        'primary-700': 'var(--p-primary-700)',
        'primary-800': 'var(--p-primary-800)',
        'primary-900': 'var(--p-primary-900)',
        'primary-950': 'var(--p-primary-950)',
        'surface-0': 'var(--p-surface-0)',
        'surface-50': 'var(--p-surface-50)',
        'surface-100': 'var(--p-surface-100)',
        'surface-200': 'var(--p-surface-200)',
        'surface-300': 'var(--p-surface-300)',
        'surface-400': 'var(--p-surface-400)',
        'surface-500': 'var(--p-surface-500)',
        'surface-600': 'var(--p-surface-600)',
        'surface-700': 'var(--p-surface-700)',
        'surface-800': 'var(--p-surface-800)',
        'surface-900': 'var(--p-surface-900)',
        'surface-950': 'var(--p-surface-950)'
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: '#333',
            a: {
              color: '#3182ce',
              '&:hover': {
                color: '#2c5282',
              },
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('tailwindcss-primeui')
  ],
} 