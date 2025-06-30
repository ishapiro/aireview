<template>
  <div class="min-h-screen bg-gray-50 overflow-x-hidden">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <NuxtLink to="/" class="flex items-center no-underline transition-all hover:opacity-80 focus:outline-none">
              <img src="/savta.webp" alt="savta.ai Logo" class="h-14 w-auto" />
            </NuxtLink>
            <span class="pb-1 pl-2 text-xl font-bold text-blue-600 self-end">savta.ai</span>
            <span class="pb-2 pl-5 text-sm font-bold text-green-600 self-end">(beta: no warranty, no support)</span>
          </div>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center space-x-4">
            <NuxtLink to="/">
              <Button icon="pi pi-home" rounded aria-label="Home" />
            </NuxtLink>
            
            <template v-if="user">
              <NuxtLink to="/saved-lists">
                <Button icon="pi pi-bookmark" rounded aria-label="Saved Lists" />
              </NuxtLink>
              <NuxtLink v-if="profile?.is_admin" to="/admin">
                <Button icon="pi pi-cog" rounded aria-label="Admin Dashboard" />
              </NuxtLink>
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

          <!-- Mobile Menu Button -->
          <div class="md:hidden flex items-center">
            <Button
              @click="mobileMenuOpen = !mobileMenuOpen"
              icon="pi pi-bars"
              rounded
              aria-label="Toggle mobile menu"
            />
          </div>
        </div>

        <!-- Mobile Navigation -->
        <div v-show="mobileMenuOpen" class="md:hidden border-t border-gray-200 bg-white">
          <div class="px-2 pt-2 pb-3 space-y-1">
            <NuxtLink 
              to="/" 
              class="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              @click="mobileMenuOpen = false"
            >
              <i class="pi pi-home mr-3 text-primary-600"></i>
              Home
            </NuxtLink>
            
            <template v-if="user">
              <NuxtLink 
                to="/saved-lists" 
                class="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                @click="mobileMenuOpen = false"
              >
                <i class="pi pi-bookmark mr-3 text-primary-600"></i>
                Saved Lists
              </NuxtLink>
              <NuxtLink 
                v-if="profile?.is_admin" 
                to="/admin" 
                class="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                @click="mobileMenuOpen = false"
              >
                <i class="pi pi-cog mr-3 text-primary-600"></i>
                Admin Dashboard
              </NuxtLink>
              <NuxtLink 
                to="/profile" 
                class="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                @click="mobileMenuOpen = false"
              >
                <i class="pi pi-user mr-3 text-primary-600"></i>
                Profile
              </NuxtLink>
              <button
                @click="handleSignOut"
                class="flex items-center w-full px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              >
                <i class="pi pi-sign-out mr-3 text-primary-600"></i>
                Sign out
              </button>
            </template>
            <template v-else>
              <NuxtLink 
                to="/auth/login" 
                class="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                @click="mobileMenuOpen = false"
              >
                <i class="pi pi-sign-in mr-3 text-primary-600"></i>
                Sign in
              </NuxtLink>
              <NuxtLink 
                to="/auth/register" 
                class="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                @click="mobileMenuOpen = false"
              >
                <i class="pi pi-user-plus mr-3 text-primary-600"></i>
                Sign up
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
            <span v-if="buildDate" class="ml-2 text-xs text-gray-400">Build: {{ buildDate }}</span>
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
import { ref, onMounted, watch } from 'vue'
import { Analytics } from '@vercel/analytics/nuxt'
const client = useSupabaseClient()
const user = useSupabaseUser()
const profile = ref(null)
const mobileMenuOpen = ref(false)
const config = useRuntimeConfig()
const buildDate = config.public.buildDate

const fetchProfile = async () => {
  if (!user.value) {
    profile.value = null
    return
  }
  const { data, error } = await client
    .from('profiles')
    .select('*')
    .eq('id', user.value.id)
    .single()
  if (!error) profile.value = data
}

onMounted(fetchProfile)
watch(user, fetchProfile)

const handleSignOut = async () => {
  await client.auth.signOut()
  navigateTo('/')
}
</script> 