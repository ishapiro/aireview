import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  console.log('=== EMAIL CHECK API START ===')
  
  try {
    const body = await readBody(event)
    const { email } = body

    console.log('Request body:', body)
    console.log('Email to check:', email)

    if (!email) {
      console.log('No email provided in request')
      throw createError({
        statusCode: 400,
        statusMessage: 'Email is required'
      })
    }

    // Use useRuntimeConfig() to access environment variables in Nuxt 3
    console.log('Getting runtime config...')
    const config = useRuntimeConfig()
    
    console.log('Runtime config keys:', Object.keys(config))
    console.log('Public config keys:', Object.keys(config.public))
    
    const supabaseUrl = config.public.supabaseUrl
    const serviceRoleKey = config.supabaseServiceRoleKey

    console.log('Environment variables check:')
    console.log('- supabaseUrl:', supabaseUrl ? 'Set' : 'Not set')
    console.log('- serviceRoleKey:', serviceRoleKey ? 'Set (length: ' + serviceRoleKey.length + ')' : 'Not set')

    if (!supabaseUrl || !serviceRoleKey) {
      console.error('Missing environment variables:', {
        supabaseUrl: !!supabaseUrl,
        serviceRoleKey: !!serviceRoleKey
      })
      
      // Return a fallback response when service role key is not available
      // This allows the registration to proceed normally and rely on Supabase's built-in duplicate detection
      console.log('Returning fallback response')
      return {
        exists: false,
        hasOAuth: false,
        providers: [],
        emailConfirmed: false,
        fallback: true
      }
    }

    console.log('Creating Supabase client...')
    // Use Supabase admin client to check if user exists
    const supabase = createClient(supabaseUrl, serviceRoleKey)
    console.log('Supabase client created successfully')

    console.log('Calling supabase.auth.admin.listUsers()...')
    // Check if user exists by email
    const { data: users, error } = await supabase.auth.admin.listUsers()
    
    console.log('listUsers response:')
    console.log('- Error:', error)
    console.log('- Users count:', users?.users?.length || 0)
    
    if (error) {
      console.error('Error listing users:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to check email: ' + error.message
      })
    }

    console.log('Searching for user with email:', email)
    // Find user with matching email
    const existingUser = users.users.find(user => user.email === email)

    if (existingUser) {
      console.log('Found existing user:', {
        id: existingUser.id,
        email: existingUser.email,
        providers: existingUser.app_metadata?.providers,
        emailConfirmed: !!existingUser.email_confirmed_at
      })
      
      // Check if user has OAuth providers
      const hasOAuthProviders = existingUser.app_metadata?.providers && 
                               existingUser.app_metadata.providers.length > 0
      
      const response = {
        exists: true,
        hasOAuth: hasOAuthProviders,
        providers: existingUser.app_metadata?.providers || [],
        emailConfirmed: !!existingUser.email_confirmed_at
      }
      
      console.log('Returning existing user response:', response)
      return response
    }

    console.log('No existing user found')
    const response = {
      exists: false,
      hasOAuth: false,
      providers: [],
      emailConfirmed: false
    }
    
    console.log('Returning no user found response:', response)
    return response

  } catch (error) {
    console.error('=== EMAIL CHECK API ERROR ===')
    console.error('Error details:', {
      message: error.message,
      statusCode: error.statusCode,
      statusMessage: error.statusMessage,
      stack: error.stack
    })
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal server error: ' + error.message
    })
  } finally {
    console.log('=== EMAIL CHECK API END ===')
  }
}) 