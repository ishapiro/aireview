/** @type {import('tailwindcss').Config} */
export default {
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
        primary: {
          DEFAULT: 'var(--primary-color)',
          hover: 'var(--primary-hover-color)',
          active: 'var(--primary-active-color)',
          contrast: 'var(--primary-contrast-color)'
        },
        surface: {
          DEFAULT: 'var(--surface-ground)',
          section: 'var(--surface-section)',
          card: 'var(--surface-card)',
          hover: 'var(--surface-hover)',
          border: 'var(--surface-border)',
          highlight: 'var(--surface-hover)',
          text: 'var(--text-color)',
          'text-secondary': 'var(--text-color-secondary)',
          'text-muted': 'var(--text-color-secondary)'
        }
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: 'var(--text-color)',
            a: {
              color: 'var(--primary-color)',
              '&:hover': {
                color: 'var(--primary-hover-color)',
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
    require('@tailwindcss/line-clamp'),
  ],
  // Ensure Tailwind classes take precedence over PrimeVue styles
  important: true,
  // Configure the order of CSS layers
  corePlugins: {
    preflight: false,
  },
} 