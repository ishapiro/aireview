<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <div class="max-w-md w-full">
      <Card>
        <template #content>
          <div class="space-y-6">
            <div class="text-center">
              <h1 class="text-2xl font-bold text-gray-900">Create your account</h1>
              <p class="mt-2 text-sm text-gray-600">
                Or
                <NuxtLink to="/auth/login" class="text-primary-600 hover:text-primary-500">
                  sign in to your account
                </NuxtLink>
              </p>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-4">
              <!-- First Name -->
              <div>
                <label for="firstName" class="block text-sm font-medium text-gray-600 mb-1">First Name</label>
                <InputText
                  id="firstName"
                  v-model="form.firstName"
                  placeholder="Your First Name"
                  :class="{ 'p-invalid': submitted && !form.firstName }"
                  class="w-full"
                  autocomplete="given-name"
                />
                <small class="text-red-500" v-if="submitted && !form.firstName">First name is required</small>
              </div>

              <!-- Last Name -->
              <div>
                <label for="lastName" class="block text-sm font-medium text-gray-600 mb-1">Last Name</label>
                <InputText
                  id="lastName"
                  v-model="form.lastName"
                  placeholder="Your Last Name"
                  :class="{ 'p-invalid': submitted && !form.lastName }"
                  class="w-full"
                  autocomplete="family-name"
                />
                <small class="text-red-500" v-if="submitted && !form.lastName">Last name is required</small>
              </div>

              <!-- Email -->
              <div>
                <label for="email" class="block text-sm font-medium text-gray-600 mb-1">Email</label>
                <InputText
                  id="email"
                  v-model="form.email"
                  type="email"
                  placeholder="Your Email"
                  :class="{ 'p-invalid': submitted && !form.email }"
                  class="w-full"
                  autocomplete="username"
                />
                <small class="text-red-500" v-if="submitted && !form.email">Email is required</small>
                <small class="text-red-500" v-if="submitted && form.email && !isValidEmail(form.email)">Please enter a valid email</small>
              </div>

              <!-- Phone -->
              <div>
                <label for="phone" class="block text-sm font-medium text-gray-600 mb-1">Phone (Optional)</label>
                <InputText
                  id="phone"
                  v-model="form.phone"
                  type="tel"
                  placeholder="Your Phone Number"
                  class="w-full"
                  autocomplete="tel"
                />
              </div>

              <!-- Website -->
              <div>
                <label for="website" class="block text-sm font-medium text-gray-600 mb-1">Website (Optional)</label>
                <InputText
                  id="website"
                  v-model="form.website"
                  type="url"
                  placeholder="https://yourwebsite.com"
                  class="w-full"
                  autocomplete="url"
                />
              </div>

              <!-- Profile Picture Section - Removed for now due to RLS policies -->
              <!-- Users can add their avatar after registration -->
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div class="flex items-center">
                  <i class="pi pi-info-circle text-blue-600 mr-2"></i>
                  <p class="text-sm text-blue-800">
                    You can add your profile picture after creating your account in the profile settings.
                  </p>
                </div>
              </div>

              <!-- Password -->
              <div>
                <label for="password" class="block text-sm font-medium text-gray-600 mb-1">Password</label>
                <Password
                  id="password"
                  v-model="form.password"
                  placeholder="Password"
                  :feedback="true"
                  toggleMask
                  :class="{ 'p-invalid': submitted && !form.password }"
                  class="w-full"
                  :inputProps="{ autocomplete: 'new-password' }"
                />
                <small class="text-red-500" v-if="submitted && !form.password">Password is required</small>
                <small class="text-red-500" v-if="submitted && form.password && form.password.length < 6">Password must be at least 6 characters</small>
              </div>

              <!-- Confirm Password -->
              <div>
                <label for="confirm-password" class="block text-sm font-medium text-gray-600 mb-1">Confirm Password</label>
                <Password
                  id="confirm-password"
                  v-model="form.confirmPassword"
                  placeholder="Confirm Password"
                  :feedback="false"
                  toggleMask
                  :class="{ 'p-invalid': submitted && !form.confirmPassword }"
                  class="w-full"
                  :inputProps="{ autocomplete: 'new-password' }"
                />
                <small class="text-red-500" v-if="submitted && !form.confirmPassword">Please confirm your password</small>
              </div>

              <!-- Terms -->
              <div class="flex items-start space-x-2">
                <Checkbox v-model="form.terms" :binary="true" inputId="terms" />
                <label for="terms" class="text-sm text-gray-600">
                  I agree to the <NuxtLink to="/terms" class="text-primary hover:text-primary-600">Terms of Service</NuxtLink> and
                  <NuxtLink to="/privacy" class="text-primary hover:text-primary-600">Privacy Policy</NuxtLink>
                </label>
              </div>

              <!-- Submit -->
              <Button
                type="submit"
                label="Create Account"
                class="w-full bg-primary hover:bg-primary-600 text-white"
                :loading="isLoading"
              />

              <!-- Test Button for Debugging -->
              <!-- <Button
                type="button"
                label="Test Supabase Config"
                class="w-full p-button-outlined p-button-secondary mt-2"
                @click="testSupabaseConfig"
              />

              <!-- Test Email Verification Settings -->
              <Button
                type="button"
                label="Test Email Verification"
                class="w-full p-button-outlined p-button-secondary mt-2"
                @click="testEmailVerification"
              />

              <!-- Test Registration Process -->
              <Button
                type="button"
                label="Test Registration (Debug)"
                class="w-full p-button-outlined p-button-secondary mt-2"
                @click="testRegistrationProcess"
              /> -->

              <!-- Google Sign Up -->
              <Button
                label="Sign up with Google"
                icon="pi pi-google"
                class="w-full p-button-outlined p-button-secondary mt-2"
                @click="handleGoogleSignUp"
                type="button"
              />

              <!-- Links -->
              <div class="text-center text-sm">
                <NuxtLink to="/auth/login" class="text-primary-600 hover:text-primary-500">
                  Already have an account? Sign in
                </NuxtLink>
              </div>
            </form>
          </div>
        </template>
      </Card>

      <!-- Toast for notifications -->
      <Toast position="top-center" />
    </div>
  </div>
</template>

<script setup>
import { useToast } from 'primevue/usetoast'

const client = useSupabaseClient()
const user = useSupabaseUser()
const toast = useToast()
const config = useRuntimeConfig()

// Redirect if already logged in
if (user.value) {
  navigateTo('/')
}

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  website: '',
  password: '',
  confirmPassword: '',
  terms: false
})

const submitted = ref(false)
const isLoading = ref(false)

const isValidEmail = (email) => {
  const emailPattern = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
  return emailPattern.test(email)
}

const handleSubmit = async () => {
  submitted.value = true

  if (!form.value.firstName || 
      !form.value.lastName ||
      !form.value.email || 
      !form.value.password || 
      !form.value.confirmPassword || 
      !form.value.terms ||
      !isValidEmail(form.value.email) ||
      form.value.password.length < 6 ||
      form.value.password !== form.value.confirmPassword) {
    return
  }

  isLoading.value = true

  try {
    console.log('=== REGISTRATION PROCESS START ===')
    console.log('Starting registration process...')
    console.log('Form data:', {
      email: form.value.email,
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      phone: form.value.phone,
      website: form.value.website
    })
    console.log('Site URL from config:', config.public.siteUrl)
    console.log('Supabase URL from config:', config.public.supabaseUrl)
    console.log('Supabase client initialized:', !!client)

    const signUpOptions = {
      email: form.value.email,
      password: form.value.password,
      options: {
        data: {
          full_name: `${form.value.firstName} ${form.value.lastName}`.trim(),
          phone: form.value.phone,
          website: form.value.website
        },
        emailRedirectTo: `${config.public.siteUrl}/auth/confirm`
      }
    }

    console.log('SignUp options:', signUpOptions)

    const { error: signUpError, data } = await client.auth.signUp(signUpOptions)

    console.log('=== SIGNUP RESPONSE ===')
    console.log('SignUp response:', { error: signUpError, data })
    console.log('User created:', !!data?.user)
    console.log('Session created:', !!data?.session)
    console.log('Email confirmation required:', data?.user && !data?.session)

    if (signUpError) {
      console.error('SignUp error details:', {
        message: signUpError.message,
        status: signUpError.status,
        name: signUpError.name
      })
      throw signUpError
    }

    // Check if email confirmation is required
    if (data.user && !data.session) {
      console.log('=== EMAIL CONFIRMATION REQUIRED ===')
      console.log('User created but no session - email confirmation required')
      console.log('User ID:', data.user.id)
      console.log('User email:', data.user.email)
      console.log('Email confirmed:', data.user.email_confirmed_at)
      console.log('Redirecting to verify-email page')
      
      // Store email in localStorage for the verify-email page
      localStorage.setItem('registration_email', form.value.email)
      navigateTo('/auth/verify-email')
    } else if (data.session) {
      console.log('=== USER SIGNED UP AND LOGGED IN ===')
      console.log('User signed up and logged in automatically')
      console.log('Session user ID:', data.session.user.id)
      console.log('Redirecting to home')
      navigateTo('/')
    } else {
      console.log('=== UNEXPECTED RESPONSE ===')
      console.log('Unexpected response - no user or session created')
      console.log('Redirecting to verify-email page as fallback')
      // Store email in localStorage for the verify-email page
      localStorage.setItem('registration_email', form.value.email)
      navigateTo('/auth/verify-email')
    }
  } catch (error) {
    console.error('=== REGISTRATION ERROR ===')
    console.error('Registration error:', error)
    console.error('Error details:', {
      message: error.message,
      status: error.status,
      name: error.name,
      stack: error.stack
    })
    
    // Check if it's an email-related error
    if (error.message?.includes('email') || error.message?.includes('Email')) {
      console.error('This appears to be an email-related error')
    }
    
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message,
      life: 3000
    })
  } finally {
    isLoading.value = false
    console.log('=== REGISTRATION PROCESS END ===')
  }
}

const handleGoogleSignUp = async () => {
  try {
    const redirectTo = `${config.public.siteUrl}/`
    const options = { provider: 'google', options: { redirectTo } }
    console.log('[GoogleSignUp] config.public.siteUrl:', config.public.siteUrl)
    console.log('[GoogleSignUp] redirectTo:', redirectTo)
    console.log('[GoogleSignUp] options:', options)
    const { data, error } = await client.auth.signInWithOAuth(options)
    console.log('[GoogleSignUp] Supabase response:', { data, error })
    if (error) throw error
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message,
      life: 3000
    })
  }
}

const testSupabaseConfig = async () => {
  console.log('Testing Supabase configuration...')
  console.log('Config:', config.public)
  console.log('Supabase client:', client)
  
  // Check environment variables through runtime config
  console.log('Environment check:')
  console.log('- NUXT_PUBLIC_SUPABASE_URL:', config.public.supabaseUrl ? 'Set' : 'Not set')
  console.log('- NUXT_PUBLIC_SUPABASE_ANON_KEY:', config.public.supabaseAnonKey ? 'Set' : 'Not set')
  console.log('- NUXT_PUBLIC_SITE_URL:', config.public.siteUrl)
  
  // Also check process.env for comparison
  console.log('Process.env check:')
  console.log('- NUXT_PUBLIC_SUPABASE_URL:', process.env.NUXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set')
  console.log('- NUXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set')
  console.log('- NUXT_PUBLIC_SITE_URL:', process.env.NUXT_PUBLIC_SITE_URL || 'Not set')
  
  try {
    // Test if we can access Supabase
    const { data, error } = await client.auth.getSession()
    console.log('Current session:', { data, error })
    
    // Test if we can get the current user
    const { data: userData, error: userError } = await client.auth.getUser()
    console.log('Current user:', { data: userData, error: userError })
    
    // Test if we can access the auth API (this will fail with anon key, but that's expected)
    console.log('Testing auth API access with anon key (expected to fail)...')
    try {
      const { data: apiData, error: apiError } = await client.auth.admin.listUsers()
      console.log('Auth API test (unexpected success):', { data: apiData, error: apiError })
    } catch (adminError) {
      console.log('Auth API test (expected failure):', adminError.message)
    }
    
    toast.add({
      severity: 'info',
      summary: 'Debug Info',
      detail: 'Check console for Supabase configuration details',
      life: 5000
    })
  } catch (error) {
    console.error('Supabase test error:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message,
      life: 3000
    })
  }
}

const testEmailVerification = async () => {
  console.log('=== EMAIL VERIFICATION TEST ===')
  
  try {
    // Test 1: Check current session and user
    console.log('1. Testing current session...')
    const { data: sessionData, error: sessionError } = await client.auth.getSession()
    console.log('Current session:', { data: sessionData, error: sessionError })
    
    // Test 2: Check if we can get user details
    console.log('2. Testing user details...')
    const { data: userData, error: userError } = await client.auth.getUser()
    console.log('Current user:', { data: userData, error: userError })
    
    // Test 3: Try to resend confirmation email if user exists but not confirmed
    if (userData?.user && !userData.user.email_confirmed_at) {
      console.log('3. Testing resend confirmation email...')
      console.log('User email:', userData.user.email)
      console.log('Email confirmed at:', userData.user.email_confirmed_at)
      
      const { data: resendData, error: resendError } = await client.auth.resend({
        type: 'signup',
        email: userData.user.email
      })
      console.log('Resend confirmation result:', { data: resendData, error: resendError })
      
      if (resendError) {
        console.error('Resend error details:', {
          message: resendError.message,
          status: resendError.status,
          name: resendError.name
        })
      } else {
        console.log('Resend confirmation email sent successfully')
      }
    } else {
      console.log('3. No unconfirmed user found for resend test')
      if (userData?.user) {
        console.log('User email confirmed at:', userData.user.email_confirmed_at)
      }
    }
    
    // Test 4: Check if we can access the auth API (this will fail with anon key, but that's expected)
    console.log('4. Testing auth API access with anon key (expected to fail)...')
    try {
      const { data: apiData, error: apiError } = await client.auth.admin.listUsers()
      console.log('Auth API test (unexpected success):', { data: apiData, error: apiError })
    } catch (adminError) {
      console.log('Auth API test (expected failure):', adminError.message)
    }
    
    // Test 5: Check Supabase project configuration
    console.log('5. Checking Supabase project configuration...')
    console.log('Supabase URL:', config.public.supabaseUrl)
    console.log('Site URL:', config.public.siteUrl)
    console.log('Redirect URL for registration:', `${config.public.siteUrl}/auth/confirm`)
    
    // Test 6: Check if we can access project settings via REST API
    console.log('6. Testing project settings access...')
    try {
      const response = await fetch(`${config.public.supabaseUrl}/rest/v1/`, {
        headers: {
          'apikey': config.public.supabaseAnonKey,
          'Authorization': `Bearer ${config.public.supabaseAnonKey}`
        }
      })
      console.log('Project REST API response status:', response.status)
      console.log('Project REST API response headers:', Object.fromEntries(response.headers.entries()))
    } catch (restError) {
      console.log('Project REST API test error:', restError.message)
    }
    
    // Test 7: Provide guidance for Supabase Dashboard settings
    console.log('7. SUPABASE DASHBOARD SETTINGS CHECKLIST:')
    console.log('Since you are using hosted Supabase, check these settings in your Supabase Dashboard:')
    console.log('')
    console.log('🔧 Go to: https://app.supabase.com/project/zaohvcwvnzqvbqobfsix')
    console.log('')
    console.log('📧 Authentication > Settings > Email Templates:')
    console.log('- Confirm signup template is enabled')
    console.log('- Check if email templates are properly configured')
    console.log('')
    console.log('🌐 Authentication > Settings > URL Configuration:')
    console.log('- Site URL should be: http://localhost:3000 (for development)')
    console.log('- Redirect URLs should include: http://localhost:3000/**')
    console.log('- Additional redirect URLs should include: http://localhost:3000')
    console.log('')
    console.log('📧 Authentication > Settings > Email Auth:')
    console.log('- Enable email confirmations: ON')
    console.log('- Enable email signup: ON')
    console.log('- Check if SMTP is configured (if not, Supabase will use default email service)')
    console.log('')
    console.log('🔍 Authentication > Users:')
    console.log('- Check if users are being created')
    console.log('- Check if email_confirmed_at is null for new users')
    console.log('')
    console.log('📊 Logs > Auth Logs:')
    console.log('- Check for any email sending errors')
    console.log('- Look for "email_confirmation_sent" events')
    console.log('- Check for any rate limiting or SMTP errors')
    
    toast.add({
      severity: 'info',
      summary: 'Email Verification Test',
      detail: 'Check console for Supabase Dashboard settings checklist',
      life: 8000
    })
    
  } catch (error) {
    console.error('Email verification test error:', error)
    toast.add({
      severity: 'error',
      summary: 'Test Error',
      detail: error.message,
      life: 3000
    })
  }
}

const testRegistrationProcess = async () => {
  console.log('=== TEST REGISTRATION PROCESS ===')
  
  try {
    // Use a test email with timestamp to avoid conflicts
    // Use a plus address with the user's real domain
    const randomString = Math.random().toString(36).substring(2, 8)
    const testEmail = `ishapiro+${randomString}@cogitations.com`
    const testPassword = 'testpassword123'
    
    console.log('Testing registration with:', {
      email: testEmail,
      password: testPassword,
      siteUrl: config.public.siteUrl,
      redirectUrl: `${config.public.siteUrl}/auth/confirm`
    })
    
    const signUpOptions = {
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: 'Test User',
          phone: '',
          website: ''
        },
        emailRedirectTo: `${config.public.siteUrl}/auth/confirm`
      }
    }
    
    console.log('SignUp options:', signUpOptions)
    
    const { error: signUpError, data } = await client.auth.signUp(signUpOptions)
    
    console.log('=== TEST SIGNUP RESPONSE ===')
    console.log('SignUp response:', { error: signUpError, data })
    console.log('User created:', !!data?.user)
    console.log('Session created:', !!data?.session)
    console.log('Email confirmation required:', data?.user && !data?.session)
    
    if (signUpError) {
      console.error('Test SignUp error details:', {
        message: signUpError.message,
        status: signUpError.status,
        name: signUpError.name
      })
      
      toast.add({
        severity: 'error',
        summary: 'Test Registration Failed',
        detail: signUpError.message,
        life: 5000
      })
      return
    }
    
    if (data.user && !data.session) {
      console.log('=== TEST EMAIL CONFIRMATION REQUIRED ===')
      console.log('Test user created successfully!')
      console.log('User ID:', data.user.id)
      console.log('User email:', data.user.email)
      console.log('Email confirmed:', data.user.email_confirmed_at)
      console.log('Email confirmation sent:', data.user.email_confirmed_at === null)
      
      toast.add({
        severity: 'success',
        summary: 'Test Registration Successful',
        detail: `Test user created: ${testEmail}. Check your email for confirmation.`,
        life: 8000
      })
      
      // Clean up test user after a delay
      setTimeout(async () => {
        try {
          console.log('Cleaning up test user...')
          const { error: deleteError } = await client.auth.admin.deleteUser(data.user.id)
          if (deleteError) {
            console.log('Could not delete test user (expected with anon key):', deleteError.message)
          } else {
            console.log('Test user deleted successfully')
          }
        } catch (cleanupError) {
          console.log('Cleanup error (expected with anon key):', cleanupError.message)
        }
      }, 10000) // Wait 10 seconds before cleanup
      
    } else if (data.session) {
      console.log('=== TEST USER SIGNED UP AND LOGGED IN ===')
      console.log('Test user signed up and logged in automatically')
      console.log('Session user ID:', data.session.user.id)
      
      toast.add({
        severity: 'success',
        summary: 'Test Registration Successful',
        detail: `Test user created and logged in: ${testEmail}`,
        life: 5000
      })
      
    } else {
      console.log('=== TEST UNEXPECTED RESPONSE ===')
      console.log('Unexpected response - no user or session created')
      
      toast.add({
        severity: 'warn',
        summary: 'Test Registration Unclear',
        detail: 'Registration response unclear. Check console for details.',
        life: 5000
      })
    }
    
  } catch (error) {
    console.error('=== TEST REGISTRATION ERROR ===')
    console.error('Test registration error:', error)
    console.error('Error details:', {
      message: error.message,
      status: error.status,
      name: error.name,
      stack: error.stack
    })
    
    toast.add({
      severity: 'error',
      summary: 'Test Registration Error',
      detail: error.message,
      life: 5000
    })
  }
}
</script> 