// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/supabase',
    '@nuxtjs/tailwindcss',
    'nuxt-primevue'
  ],
  primevue: {
    cssLayerOrder: 'tailwind-base, primevue, tailwind-utilities',
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
    },
    services: {
      include: ['ToastService', 'ConfirmationService']
    },
    options: {
      unstyled: true,
      ripple: true,
      inputStyle: 'filled',
      pt: {}
    }
  },
  css: [
    '@/assets/css/main.css',
    '@/assets/css/primevue.css',
    'primeicons/primeicons.css'
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
        '/terms'
      ]
    }
  },
  nitro: {
    compatibilityDate: '2025-06-17'
  }
}) 