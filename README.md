# Cogitations Reviews

A modern product reviews and recommendations platform built with Nuxt 3, Supabase, PrimeVue, and TailwindCSS.

Integrates AI for both review generation and user driven updates.

## 🌟 Features

- User authentication and authorization (email/password + Google OAuth)
- Email duplicate detection system
- Product review creation and management
- AI-powered content generation for reviews
- Search functionality
- User profiles
- Admin dashboard
- Responsive design
- Email verification

## 🛠️ Tech Stack

- **Frontend Framework**: [Nuxt 3](https://nuxt.com/)
- **UI Components**: [PrimeVue](https://primevue.org/) (v3.49.1)
- **Styling**: [TailwindCSS](https://tailwindcss.com/) + [PrimeFlex](https://primevue.org/primeflex/)
- **Backend/Database**: [Supabase](https://supabase.com/)
- **Authentication**: Supabase Auth with Google OAuth
- **AI Integration**: CloudFlare Workers (OpenAI Proxy)
- **Icons**: [PrimeIcons](https://primevue.org/icons/) (v6.0.1)

## 📋 Prerequisites

- Node.js (v18 or higher)
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
NUXT_PUBLIC_COGITATIONS_CLOUDFLARE_TOKEN=your-cloudflare-token
```

On the hosting platform you need to replicate these environment variable and set
the SITE_URL to https://savta.ai.

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
   - Also add https://savta.ai

### 4. Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your application.

## ⚙️ Configuration

### PrimeVue Setup

This project uses PrimeVue with a custom configuration optimized for Nuxt 3 and TailwindCSS integration.

#### Nuxt Configuration (`nuxt.config.js`)

```javascript
export default defineNuxtConfig({
  css: [
    'primevue/resources/themes/lara-light-indigo/theme.css',
    'primevue/resources/primevue.css',
    'primeicons/primeicons.css',
    'primeflex/primeflex.css',
    '@/assets/css/main.css'
  ],
  build: {
    transpile: ['primevue']  // Required to prevent import errors
  }
})
```

#### Plugin Configuration (`plugins/primevue.js`)

```javascript
nuxtApp.vueApp.use(PrimeVue, {
  unstyled: false,           // Use styled components
  ripple: true,              // Enable ripple effects
  inputStyle: 'filled',      // Use filled input style
  pt: {                      // PassThrough configuration for custom styling
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
```

#### Registered Components

- **Form Components**: `Button`, `InputText`, `Password`, `Textarea`, `InputNumber`, `InputSwitch`, `Checkbox`, `Dropdown`
- **Layout Components**: `Card`, `Dialog`, `ConfirmDialog`, `ConfirmPopup`
- **Feedback Components**: `Toast`, `ProgressSpinner`, `ProgressBar`, `Tag`
- **Navigation Components**: `Paginator`
- **Directives**: `Tooltip`

#### Services

- **ToastService**: For displaying toast notifications
- **ConfirmationService**: For confirmation dialogs and popups

### Supabase Configuration

The Supabase module is configured with session management to prevent auto-import errors:

```javascript
supabase: {
  clientOptions: {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
}
```

## 🔐 Core Features

### Email Duplicate Detection System

Prevents users from creating multiple accounts with the same email address when using different authentication methods.

#### How It Works

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

### AI Content Generation

AI-powered content generation feature that helps users create review content using OpenAI's GPT models.

#### Features

- **Interactive Dialog**: Opens a modal dialog for entering AI prompts
- **Real-time Generation**: Generates content using the specified AI endpoint
- **Content Preview**: Shows rendered markdown preview of generated content
- **Summary Generation**: Automatically generates both content and summary
- **Multiple Actions**: 
  - Use generated content directly
  - Append to existing content
  - Refine prompt and regenerate
- **Error Handling**: Displays clear error messages for failed requests
- **Loading States**: Shows spinner during content generation
- **Cross-Page Integration**: Available on all review creation and editing pages

#### Implementation

**Shared Component**: `components/AIContentGenerator.vue`

**API Configuration**:
```javascript
const requestBody = {
  prompt: userPrompt,
  model: 'gpt-3.5-turbo'
}

const response = await fetch('https://cogitations-review-ai.cogitations.workers.dev', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${config.public.cogitationsCloudflareToken}`
  },
  body: JSON.stringify(requestBody)
})
```

**Component Usage**:
```vue
<AIContentGenerator
  v-model="form.content"
  :summary-value="form.summary"
  :generate-summary="true"
  @update:summary-value="form.summary = $event"
  @ai-generated="form.ai_generated = true"
/>
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
   ```

3. **Set Environment Variables** in Vercel dashboard:
   - `NUXT_PUBLIC_SUPABASE_URL`
   - `NUXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NUXT_PUBLIC_SITE_URL` (production URL)
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NUXT_PUBLIC_COGITATIONS_CLOUDFLARE_TOKEN`

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

5. **`[unimport] failed to find "useSupabaseSession"` Error**:
   - This occurs due to Nuxt's auto-import instability with Supabase
   - Solution: Use the `clientOptions` configuration shown in the Supabase Configuration section
   - Alternative: Clear Nuxt cache with `npx nuxi cleanup`

### Supabase Dependency Issues

If you encounter issues with Supabase dependencies or module conflicts:

```bash
# 1. Remove node_modules and lock file to prevent conflicts
rm -rf node_modules package-lock.json

# 2. Install stable version of Supabase
npm install @nuxtjs/supabase@1.4.1

# 3. Reinstall all dependencies
npm install

# 4. Clean Nuxt build
rm -rf .nuxt

# 5. Run dev server
npm run dev
```

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