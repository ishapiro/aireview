<template>
  <div class="min-h-screen bg-gray-50 overflow-x-hidden">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <NuxtLink to="/" class="flex items-center no-underline transition-all hover:opacity-80 focus:outline-none">
              <span class="text-2xl font-bold text-primary-600">C</span>
              <span class="ml-2 text-xl font-bold text-gray-900">Cogitations</span>
            </NuxtLink>
          </div>

          <div class="flex items-center space-x-4">
            <NuxtLink to="/">
              <Button icon="pi pi-home" rounded aria-label="Home" />
            </NuxtLink>
            
            <template v-if="user">
              <NuxtLink to="/profile">
                <Button 
                  icon="pi pi-user"  
                  rounded 
                  aria-label="Profile"
                />
              </NuxtLink>
              <Button
                @click="handleSignOut"
                icon="pi pi-sign-out"
                rounded
                aria-label="Sign out"
              />
            </template>
            <template v-else>
              <NuxtLink to="/auth/login">
                <Button label="Sign in" />
              </NuxtLink>
              <NuxtLink to="/auth/register">
                <Button label="Sign up" />
              </NuxtLink>
            </template>
          </div>
        </div>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center">
          <div class="text-gray-500 text-sm">
            © {{ new Date().getFullYear() }} Cogitations. All rights reserved.
          </div>
          <div class="flex space-x-6">
            <NuxtLink to="/about" class="text-gray-500 hover:text-gray-900">
              About
            </NuxtLink>
            <NuxtLink to="/privacy" class="text-gray-500 hover:text-gray-900">
              Privacy
            </NuxtLink>
            <NuxtLink to="/terms" class="text-gray-500 hover:text-gray-900">
              Terms
            </NuxtLink>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
const client = useSupabaseClient()
const user = useSupabaseUser()

const handleSignOut = async () => {
  await client.auth.signOut()
  navigateTo('/')
}
</script> 