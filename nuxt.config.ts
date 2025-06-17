// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

declare module '@nuxt/schema' {
  interface NuxtConfig {
    supabase?: {
      redirectOptions?: {
        login?: string
        callback?: string
        exclude?: string[]
      }
    }
  }
}

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/supabase',
    '@nuxtjs/tailwindcss',
    ['nuxt-primevue', {
      components: {
        include: [
          'Button',
          'Card',
          'Password',
          'InputText',
          'Toast',
          'Checkbox',
          'Dropdown',
          'Paginator',
          'Tag',
          'Textarea',
          'Dialog',
          'ConfirmDialog',
          'ConfirmPopup'
        ]
      },
      directives: {
        include: ['Ripple', 'Tooltip']
      }
    }]
  ],
  css: [
    'primevue/resources/themes/lara-light-blue/theme.css',
    'primevue/resources/primevue.css',
    'primeicons/primeicons.css',
    '@/assets/css/main.css'
  ],
  build: {
    transpile: ['primevue']
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
        '/terms'
      ]
    }
  },
  nitro: {
    compatibilityDate: '2025-06-17'
  }
}) 