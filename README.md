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
- **UI Components**: [PrimeVue](https://primevue.org/) (unstyled mode)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **Backend/Database**: [Supabase](https://supabase.com/)
- **Authentication**: Supabase Auth with Google OAuth
- **CloudFlare**: OpenAI Proxy implemented as a worker

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
NUXT_PUBLIC_COGITATIONS_CLOUDFLARE_TOKEN=your-cloudflare-token
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

## 🤖 AI Content Generation

This project includes an AI-powered content generation feature that helps users create review content using OpenAI's GPT models.

### Features

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

### How It Works

1. **Prompt Input**: Users enter a custom prompt describing the desired review content
2. **API Integration**: Sends request to `cogitations-review-ai.cogitations.workers.dev`
3. **Response Handling**: Processes and displays the AI-generated content
4. **Content Integration**: Allows users to use or append the generated content to their review
5. **Summary Generation**: When enabled, generates both content and summary simultaneously

### Implementation Details

**Shared Component**: `components/AIContentGenerator.vue`

**Available Pages**:
- `components/ReviewEditor.vue` - Main review editor component
- `pages/admin/reviews/new.vue` - Create new review page
- `pages/admin/reviews/[id].vue` - Edit existing review page

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

**Environment Variable**: `NUXT_PUBLIC_COGITATIONS_CLOUDFLARE_TOKEN` - Required for API authentication

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

### Usage

1. Click the "Generate with AI" button next to the content field on any review page
2. Enter your prompt describing the review content you want to generate
3. Click "Generate Content" to send the request
4. Review the generated content in the preview
5. Choose to:
   - **Use This Content**: Replace existing content with AI-generated content
   - **Append to Existing**: Add AI content to the end of existing content
   - **Refine Prompt**: Modify the prompt and generate new content
6. The "AI Generated" checkbox is automatically checked when using AI content
7. When summary generation is enabled, both content and summary are populated

### Summary Generation

The AI system can generate both detailed content and concise summaries:
- **Summary**: Brief 2-3 sentence overview of the review
- **Content**: Detailed markdown-formatted review content
- **Automatic Parsing**: AI response is parsed to extract both sections
- **Fallback**: If parsing fails, full response is used as content



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

### Debugging Tips

- Check browser console for configuration warnings
- Use server console logs for API debugging
- Test authentication flows in both development and production
- Verify all environment variables are properly set

### Supabase Dependency Issues

If you encounter issues with Supabase dependencies or module conflicts, use this solution:

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

This approach ensures a clean installation with a stable version of the Supabase module and resolves dependency conflicts that may occur during development.

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

## 🐞 Troubleshooting

### `[unimport] failed to find "useSupabaseSession"` Error

This error can occur intermittently during development, especially after stopping and restarting the `npm run dev` server. It's caused by an instability in how Nuxt's auto-import feature interacts with the `@nuxtjs/supabase` module's session management.

Standard solutions like clearing the Nuxt cache (`npx nuxi cleanup`) or reinstalling dependencies (`rm -rf node_modules && npm install`) may not permanently fix this issue.

#### ✅ The Permanent Solution

The most reliable solution is to explicitly define the client-side session handling behavior for the Supabase module in your `nuxt.config.js` file.

Add the following `clientOptions` to the `supabase` configuration object:

```javascript
// nuxt.config.js

export default defineNuxtConfig({
  // ... other config
  supabase: {
    // ... other supabase config
    clientOptions: {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    }
  },
  // ... other config
})
```

This configuration enforces a stable session management strategy, which prevents the auto-import errors from occurring during server restarts in the development environment. 