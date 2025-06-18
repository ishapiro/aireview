// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: process.env.NODE_ENV === 'development' },
  modules: [
    '@nuxtjs/supabase',
    '@nuxtjs/tailwindcss'
  ],
  css: [
    'primevue/resources/themes/lara-light-indigo/theme.css',
    'primevue/resources/primevue.css',
    'primeicons/primeicons.css',
    'primeflex/primeflex.css',
    '@/assets/css/main.css'
  ],
  build: {
    transpile: ['primevue']
  },
  postcss: {
    plugins: {
      'postcss-import': {},
      'tailwindcss/nesting': {},
      tailwindcss: {},
      autoprefixer: {}
    }
  },
  app: {
    head: {
      title: 'Cogitations Reviews',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { 
          key: 'description', 
          name: 'description', 
          content: 'Product reviews and recommendations platform'
        }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
  supabase: {
    redirectOptions: {
      login: '/auth/login',
      callback: '/auth/confirm',
      exclude: [
        '/auth/login',
        '/auth/register',
        '/auth/confirm',
        '/auth/verify-email',
        '/',
        '/search',
        '/about',
        '/privacy',
        '/terms',
        '/reviews/*'
      ]
    }
  },
  nitro: {
    compatibilityDate: '2025-06-17',
    preset: 'vercel'
  },
  router: {
    options: {
      strict: false
    }
  },
  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    }
  }
}) 