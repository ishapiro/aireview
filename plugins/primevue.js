import { defineNuxtPlugin } from '#app'
import PrimeVue from 'primevue/config'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Card from 'primevue/card'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import Checkbox from 'primevue/checkbox'
import Dropdown from 'primevue/dropdown'
import Paginator from 'primevue/paginator'
import Tag from 'primevue/tag'
import Textarea from 'primevue/textarea'
import Dialog from 'primevue/dialog'
import ConfirmDialog from 'primevue/confirmdialog'
import ConfirmPopup from 'primevue/confirmpopup'
import ConfirmationService from 'primevue/confirmationservice'
import ProgressSpinner from 'primevue/progressspinner'
import InputSwitch from 'primevue/inputswitch'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PrimeVue, {
    unstyled: false,
    ripple: true,
    inputStyle: 'filled',
    pt: {
      card: {
        root: { class: 'bg-white shadow-md rounded-lg' },
        content: { class: 'p-6' }
      },
      button: {
        root: { class: 'bg-primary-600 hover:bg-primary-700 text-white' }
      },
      inputtext: {
        root: { class: 'w-full' }
      },
      password: {
        root: { class: 'w-full' }
      }
    }
  })

  // Register components
  nuxtApp.vueApp.component('Button', Button)
  nuxtApp.vueApp.component('InputText', InputText)
  nuxtApp.vueApp.component('Password', Password)
  nuxtApp.vueApp.component('Card', Card)
  nuxtApp.vueApp.component('Toast', Toast)
  nuxtApp.vueApp.component('Checkbox', Checkbox)
  nuxtApp.vueApp.component('Dropdown', Dropdown)
  nuxtApp.vueApp.component('Paginator', Paginator)
  nuxtApp.vueApp.component('Tag', Tag)
  nuxtApp.vueApp.component('Textarea', Textarea)
  nuxtApp.vueApp.component('Dialog', Dialog)
  nuxtApp.vueApp.component('ConfirmDialog', ConfirmDialog)
  nuxtApp.vueApp.component('ConfirmPopup', ConfirmPopup)
  nuxtApp.vueApp.component('ProgressSpinner', ProgressSpinner)
  nuxtApp.vueApp.component('InputSwitch', InputSwitch)

  // Register services
  nuxtApp.vueApp.use(ToastService)
  nuxtApp.vueApp.use(ConfirmationService)
}) 