// https://nuxt.com/docs/api/configuration/nuxt-config
import fs from 'fs'
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
    url: process.env.NUXT_PUBLIC_SUPABASE_URL,
    key: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY,
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
        '/reviews/*',
        '/categories/*'
      ]
    },
    clientOptions: {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    }
  },
  nitro: {
    compatibilityDate: '2025-06-22'
    // preset: 'vercel' // Temporarily disabled for local development
  },
  router: {
    options: {
      strict: false
    },
    middleware: ['auth-admin']
  },
  runtimeConfig: {
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    // Amazon PA-API credentials (server-side only)
    amazonAccessKey: process.env.AMAZON_ACCESS_KEY,
    amazonSecretKey: process.env.AMAZON_SECRET_KEY,
    amazonPartnerTag: process.env.AMAZON_PARTNER_TAG,
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY,
      cogitationsCloudflareToken: process.env.NUXT_PUBLIC_COGITATIONS_CLOUDFLARE_TOKEN,
      unsplashAccessKey: process.env.NUXT_PUBLIC_UNSPLASH_ACCESS_KEY,
      buildDate: fs.existsSync('.build-date') ? fs.readFileSync('.build-date', 'utf-8') : ''
    }
  }
}) 