import { useSupabaseUser, useSupabaseClient } from '#imports'
import { defineNuxtRouteMiddleware, navigateTo } from '#app'

export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser()
  
  // Check if user is logged in
  if (!user.value) {
    return navigateTo('/auth/login')
  }

  // Get user's profile to check admin status
  const client = useSupabaseClient()
  const { data: profile } = await client
    .from('profiles')
    .select('is_admin')
    .eq('id', user.value.id)
    .single()

  // If user is not an admin, redirect to home
  if (!profile?.is_admin) {
    return navigateTo('/')
  }
}) 