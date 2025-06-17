export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('page:middleware', (middleware) => {
    // Add admin middleware to all routes under /admin
    if (middleware.route.path.startsWith('/admin')) {
      middleware.middleware.push('admin')
    }
  })
}) 