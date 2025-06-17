import { defineNuxtPlugin } from '#app'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'

export default defineNuxtPlugin((nuxtApp) => {
  // Skip if already installed
  if (nuxtApp.vueApp._context.provides['plugin-vue-primevue']) {
    return
  }

  nuxtApp.vueApp._context.provides['plugin-vue-primevue'] = true

  nuxtApp.vueApp.use(PrimeVue, {
    unstyled: true,
    ripple: true,
    inputStyle: 'filled'
  })

  // Only install services if not already present
  if (!nuxtApp.vueApp._context.provides['primevue.toastservice']) {
    nuxtApp.vueApp.use(ToastService)
  }
  
  if (!nuxtApp.vueApp._context.provides['primevue.confirmationservice']) {
    nuxtApp.vueApp.use(ConfirmationService)
  }
}) 