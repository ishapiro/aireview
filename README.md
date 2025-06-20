# Cogitations Reviews

A modern product reviews and recommendations platform built with Nuxt 3, Supabase, PrimeVue, and TailwindCSS.

## 🌟 Features

- User authentication and authorization (email/password + Google OAuth)
- Email duplicate detection system
- Product review creation and management
- Search functionality
- User profiles
- Admin dashboard
- Responsive design
- Email verification

## 🛠️ Tech Stack

- **Frontend Framework**: [Nuxt 3](https://nuxt.com/)
- **UI Components**: [PrimeVue](https://primevue.org/) (unstyled mode)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **Backend/Database**: [Supabase](https://supabase.com/)
- **Authentication**: Supabase Auth with Google OAuth

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git
- Supabase account
- Google Cloud Console account (for OAuth)

## 🚀 Getting Started

### 1. Clone and Install

```bash
git clone https://github.com/[your-username]/cogitations-reviews.git
cd cogitations-reviews
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
NUXT_PUBLIC_SUPABASE_URL=your-project-url
NUXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NUXT_PUBLIC_SITE_URL=http://localhost:3000
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Supabase Configuration

1. **Create a Supabase project** at [https://app.supabase.com](https://app.supabase.com)
2. **Get your credentials** from Project Settings > API:
   - Project URL → `NUXT_PUBLIC_SUPABASE_URL`
   - Anon key → `NUXT_PUBLIC_SUPABASE_ANON_KEY`
   - Service role key → `SUPABASE_SERVICE_ROLE_KEY`

3. **Initialize database schema**:
   - Go to SQL Editor in your Supabase dashboard
   - Copy and execute the contents of `supabase/schema.sql`

4. **Configure Authentication**:
   - **Email Auth**: Enable "Enable email signup" and "Enable email confirmations"
   - **URL Configuration**: Set Site URL to `http://localhost:3000`
   - **Redirect URLs**: Add `http://localhost:3000/**`

5. **Set up Google OAuth**:
   - Enable Google provider in Authentication > Providers
   - Configure OAuth credentials in [Google Cloud Console](https://console.cloud.google.com)
   - Add redirect URI: `https://<your-project>.supabase.co/auth/v1/callback`

### 4. Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your application.

## 🔐 Email Duplicate Detection System

This project implements a robust system to prevent users from creating multiple accounts with the same email address when using different authentication methods.

### How It Works

1. **Server-Side API** (`server/api/auth/check-email.post.js`):
   - Uses Supabase service role key to access admin API
   - Checks if an email already exists
   - Identifies OAuth providers (Google) vs email/password accounts

2. **Client-Side Integration** (`pages/auth/register.vue`):
   - Calls server API before registration
   - Shows appropriate warnings for existing accounts
   - Prevents duplicate account creation

3. **Fallback Mechanism**:
   - Works even without service role key
   - Falls back to Supabase's built-in duplicate detection

### Key Implementation Details

**Environment Variables in Nuxt 3:**
```javascript
// Client-side
const config = useRuntimeConfig()
const supabaseUrl = config.public.supabaseUrl

// Server-side
const config = useRuntimeConfig()
const serviceRoleKey = config.supabaseServiceRoleKey
```

**$fetch Response Handling:**
```javascript
// Correct way in Nuxt 3
const response = await $fetch('/api/auth/check-email', {
  method: 'POST',
  body: { email }
})
```

## 🎨 PrimeVue + TailwindCSS Integration

This project uses PrimeVue in unstyled mode with TailwindCSS for complete styling control.

### Configuration

**Nuxt Config** (`nuxt.config.js`):
```javascript
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', 'nuxt-primevue'],
  primevue: {
    cssLayerOrder: 'tailwind-base, primevue, tailwind-utilities',
    options: { unstyled: true, ripple: true },
    components: {
      include: ['Button', 'Card', 'InputText', 'Password', 'Checkbox']
    }
  },
  css: [
    'primevue/resources/primevue.css',
    'primeicons/primeicons.css',
    '@/assets/css/main.css'
  ]
})
```

**Tailwind Config** (`tailwind.config.js`):
```javascript
module.exports = {
  content: [
    'node_modules/primevue/**/*.{vue,js,ts,jsx,tsx}',
    // ... your content paths
  ],
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-primeui')
  ]
}
```

### Usage

```vue
<template>
  <Button class="bg-blue-500 hover:bg-blue-600 text-white">
    Custom Styled Button
  </Button>
</template>
```

## 🚀 Deployment

### Vercel Deployment

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Build and Deploy**:
   ```bash
   npm run build
   vercel deploy --prebuilt --prod
   ```

3. **Set Environment Variables** in Vercel dashboard:
   - `NUXT_PUBLIC_SUPABASE_URL`
   - `NUXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NUXT_PUBLIC_SITE_URL` (production URL)
   - `SUPABASE_SERVICE_ROLE_KEY`

### Production Configuration

1. **Update Supabase Settings**:
   - Site URL: Your production domain
   - Redirect URLs: Add your production domain with wildcards

2. **Update Google OAuth**:
   - Add production domain to authorized origins
   - Add production callback URLs

## 🔧 Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**:
   - Restart dev server after changing `.env`
   - Use `useRuntimeConfig()` not `process.env`

2. **Email Duplicate Detection Not Working**:
   - Verify `SUPABASE_SERVICE_ROLE_KEY` is set
   - Check server console for API errors
   - Ensure service role key has admin privileges

3. **PrimeVue Styling Issues**:
   - Check CSS layer order in `nuxt.config.js`
   - Ensure components are included in PrimeVue config
   - Use browser dev tools to inspect applied styles

4. **Google OAuth Redirect Errors**:
   - Verify redirect URLs in both Supabase and Google Cloud Console
   - Use wildcards in Supabase, exact URLs in Google Cloud
   - Check environment variables are set correctly

### Debugging Tips

- Check browser console for configuration warnings
- Use server console logs for API debugging
- Test authentication flows in both development and production
- Verify all environment variables are properly set

## 📁 Project Structure

```
cogitations-reviews/
├── app.vue                 # App entry point
├── assets/                 # Static assets and CSS
├── components/             # Vue components
├── layouts/                # Page layouts
├── pages/                  # Application pages
├── plugins/                # Nuxt plugins
├── public/                 # Public static files
├── server/                 # Server-side API endpoints
├── supabase/               # Supabase configuration
└── utils/                  # Utility functions
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

[MIT License](LICENSE)

## 🔗 References

- [Nuxt 3 Documentation](https://nuxt.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [PrimeVue Documentation](https://primevue.org/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs) 