# Cogitations Reviews

A modern product reviews and recommendations platform built with Nuxt 3, Supabase, PrimeVue, and TailwindCSS.

## 🌟 Features

- User authentication and authorization
- Product review creation and management
- Search functionality
- User profiles
- Admin dashboard
- Responsive design
- Email verification

## 🛠️ Tech Stack

- **Frontend Framework**: [Nuxt 3](https://nuxt.com/)
- **UI Components**: [PrimeVue](https://primevue.org/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **Backend/Database**: [Supabase](https://supabase.com/)

## 🎨 PrimeVue with Tailwind CSS Integration

This project uses PrimeVue in unstyled mode with Tailwind CSS for styling. Here's how the integration is set up:

### Required Dependencies

```bash
npm install primevue@^3.46.0 primeicons@^6.0.1 nuxt-primevue@^3.0.0 @tailwindcss/forms postcss postcss-import tailwindcss-primeui --save-dev
```

### Configuration Files

1. **Nuxt Configuration** (`nuxt.config.js`):
```javascript
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-primevue'
  ],
  primevue: {
    usePrimeVue: true,
    options: {
      unstyled: true,
      ripple: true
    },
    components: {
      include: ['Button', 'Card', /* other components */]
    }
  },
  css: [
    '@/assets/css/main.css',
    'primeicons/primeicons.css'
  ]
})
```

2. **Tailwind Configuration** (`tailwind.config.js`):
```javascript
module.exports = {
  darkMode: 'class',
  content: [
    // ... your content paths
    'node_modules/primevue/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'primary-50': 'var(--p-primary-50)',
        // ... other color variables
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('tailwindcss-primeui')
  ]
}
```

3. **PostCSS Configuration** (`postcss.config.js`):
```javascript
module.exports = {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: {}
  }
}
```

4. **Main CSS** (`assets/css/main.css`):
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* PrimeVue color variables */
  --p-primary-50: #f0f9ff;
  /* ... other color variables */
}

/* Light Mode */
:root {
  --p-text-color: var(--p-surface-700);
  /* ... other theme variables */
}

/* Dark Mode */
.dark {
  --p-text-color: var(--p-surface-0);
  /* ... other dark mode variables */
}
```

5. **PrimeVue Plugin** (`plugins/primevue.js`):
```javascript
import { defineNuxtPlugin } from '#app'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PrimeVue, {
    unstyled: true,
    ripple: true,
    inputStyle: 'filled'
  })
  nuxtApp.vueApp.use(ToastService)
  nuxtApp.vueApp.use(ConfirmationService)
})
```

### Usage Tips

1. **Component Styling**:
   - Use Tailwind classes directly on PrimeVue components
   - For custom styling, use the `class` prop on PrimeVue components
   - Use the `unstyled` prop for complete control over styling

2. **Dark Mode**:
   - Add the `dark` class to your root element to enable dark mode
   - Use the `dark:` prefix in Tailwind classes for dark mode styles

3. **Form Elements**:
   - Use the `@tailwindcss/forms` plugin for consistent form styling
   - PrimeVue form components work well with Tailwind's form styles

4. **Common Issues**:
   - If styles aren't applying, check that the component is included in the PrimeVue configuration
   - For custom components, ensure they're included in the Tailwind content paths
   - Use the browser's dev tools to inspect the applied classes and styles
   - If you see "Plugin has already been applied" warnings, ensure your PrimeVue plugin checks for existing installations
   - If you see PostCSS configuration warnings, move your PostCSS config into the Nuxt config file

### Troubleshooting

1. **PostCSS Configuration Warning**:
   Instead of using a separate `postcss.config.js` file, include the PostCSS configuration in your `nuxt.config.js`:

   ```javascript
   export default defineNuxtConfig({
     // ... other config
     postcss: {
       plugins: {
         'postcss-import': {},
         'tailwindcss/nesting': {},
         tailwindcss: {},
         autoprefixer: {}
       }
     }
   })
   ```

2. **PrimeVue Plugin Warnings**:
   To prevent "Plugin has already been applied" warnings, check for existing installations in your PrimeVue plugin:

   ```javascript
   export default defineNuxtPlugin((nuxtApp) => {
     if (!nuxtApp.vueApp._context.provides.primevue) {
       nuxtApp.vueApp.use(PrimeVue, {
         unstyled: true,
         ripple: true,
         inputStyle: 'filled'
       })
     }
     // ... other services
   })
   ```

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git
- Supabase account

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/[your-username]/cogitations-reviews.git
cd cogitations-reviews
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Supabase Setup

1. **Create a new Supabase project** at [https://app.supabase.com](https://app.supabase.com)
2. **Get your project URL and anon key** from Project Settings > API
3. **Create a `.env` file** in the root directory:

```env
SUPABASE_URL=your-project-url
SUPABASE_KEY=your-anon-key
NUXT_PUBLIC_SUPABASE_URL=your-project-url
NUXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NUXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. **Initialize the database schema**:
   - Navigate to the SQL editor in your Supabase dashboard
   - Copy the contents of `supabase/schema.sql`
   - Execute the SQL commands to set up your database schema

5. **Configure Authentication Settings**:

   **A. Email Authentication Setup:**
   - Go to Authentication > Settings > Email Auth
   - Enable "Enable email signup"
   - Enable "Enable email confirmations"
   - Set "Secure email change" to your preference
   - Configure "Minimum password length" (default: 6)

   **B. URL Configuration:**
   - Go to Authentication > Settings > URL Configuration
   - Set "Site URL" to `http://localhost:3000` (for development)
   - Add "Redirect URLs":
     ```
     http://localhost:3000/**
     https://your-production-domain.com/**
     ```
   - Add "Additional redirect URLs":
     ```
     http://localhost:3000
     https://your-production-domain.com
     ```

   **C. Email Templates (Optional):**
   - Go to Authentication > Settings > Email Templates
   - Customize "Confirm signup" template if desired
   - Test email templates to ensure they work correctly

6. **Set up Google OAuth** (for Google Sign-In):
   - In your Supabase dashboard, go to Authentication → Providers
   - Find Google and enable it
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing one
   - Enable the Google+ API
   - Go to Credentials → Create Credentials → OAuth client ID
   - Choose "Web application"
   - Add authorized redirect URI: `https://<your-project>.supabase.co/auth/v1/callback`
   - Copy the Client ID and Client Secret
   - Paste these credentials back in Supabase Google Provider settings

7. **Production Configuration**:
   - Update "Site URL" to your production domain
   - Add production redirect URLs
   - Set environment variables in your hosting platform (Vercel, etc.)
   - Update Google OAuth settings with production URLs

### 4. Authentication Troubleshooting

**Common Issues and Solutions:**

1. **Email verification not working:**
   - Check Authentication > Settings > Email Auth is enabled
   - Verify URL Configuration has correct redirect URLs
   - Check Authentication > Logs for email sending errors
   - Ensure your domain is not blocked by email providers

2. **Redirect URL errors:**
   - Add wildcards (`**`) to redirect URLs for flexibility
   - Include both `http://localhost:3000` and `https://localhost:3000`
   - Add your production domain to redirect URLs

3. **Environment variables not loading:**
   - Ensure `.env` file is in the root directory
   - Restart development server after changing `.env`
   - Check `nuxt.config.js` has proper `runtimeConfig` setup

4. **Google OAuth not working:**
   - Verify Google Cloud Console settings
   - Check redirect URIs match exactly
   - Ensure Google+ API is enabled
   - Verify Client ID and Secret are correct

5. **Rate limiting issues:**
   - Check Authentication > Settings > Rate Limits
   - Adjust limits if needed for development
   - Monitor Authentication > Logs for rate limit errors

**Testing Authentication:**

The application includes built-in testing functions (commented out in production):
- Test Supabase configuration
- Test email verification settings
- Test registration process with debug logging

To enable testing, uncomment the test buttons in `pages/auth/register.vue`.

### 5. Development Server

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

### 6. Production Build

```bash
npm run build
# or
yarn build
```

## 🚀 Deploying to Vercel (via CLI)

You can deploy this project to [Vercel](https://vercel.com/) using the Vercel CLI, without connecting to GitHub. Here are the steps:

1. **Install the Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```
   Follow the prompts to authenticate with your email.

3. **Build the Project**
   ```bash
   npm install
   npm run build
   ```

4. **Deploy to Vercel**
   ```bash
   vercel deploy --prebuilt
   ```
   - The first time, you may be prompted to set up the project. Accept the defaults or adjust as needed.
   - To deploy to your production domain, use:
     ```bash
     vercel deploy --prebuilt --prod
     ```

5. **Configuration**
   - The project includes a `vercel.json` file with recommended settings for Nuxt 3.
   - You can adjust environment variables and other settings in the Vercel dashboard or in `vercel.json`.

6. **After Deployment**
   - Vercel will provide a deployment URL in the terminal output.
   - Visit the URL to see your live site!

For more details, see the [Vercel CLI documentation](https://vercel.com/docs/cli).

## 🔧 Configuration

### PrimeVue Components

The project uses specific PrimeVue components configured in `nuxt.config.ts`. If you need additional components, add them to the components array in the configuration:

```typescript
['nuxt-primevue', {
  components: {
    include: ['Button', 'Card', /* other components */]
  }
}]
```

### Supabase Authentication

Protected routes are configured in `nuxt.config.ts`. To modify which routes require authentication, update the `exclude` array in the Supabase configuration:

```typescript
supabase: {
  redirectOptions: {
    login: '/auth/login',
    callback: '/auth/confirm',
    exclude: [/* public routes */]
  }
}
```

## 📁 Project Structure

```
cogitations-reviews/
├── app.vue              # App entry point
├── assets/             # Static assets
├── components/         # Vue components
├── layouts/            # Page layouts
├── pages/             # Application pages
├── public/            # Public static files
├── supabase/          # Supabase configuration
└── utils/             # Utility functions
```

## 🔐 Environment Variables

Required environment variables:

```env
SUPABASE_URL=your-supabase-project-url
SUPABASE_KEY=your-supabase-anon-key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

[MIT License](LICENSE)

## 🆘 Support

For support, please open an issue in the GitHub repository or contact the maintainers.

## ⚠️ Important Configuration Notes

Before diving into the setup, please be aware of these critical configuration requirements that will save you time and prevent common issues:

### PrimeVue + Nuxt 3 + Tailwind Integration

1. **Version Compatibility**
   ```bash
   npm install primevue@^3.49.1 primeicons@^6.0.1 nuxt-primevue@^3.0.0 @tailwindcss/forms postcss@^8.5.6 postcss-import tailwindcss-primeui --save-dev
   ```
   - Use PrimeVue 3.49.1 or later to avoid PT configuration issues
   - Ensure postcss version is compatible with your Nuxt version

2. **Critical Configuration Order**
   The order of configuration is crucial to prevent styling conflicts:

   ```javascript
   // nuxt.config.js
   export default defineNuxtConfig({
     modules: [
       '@nuxtjs/supabase',
       '@nuxtjs/tailwindcss',
       'nuxt-primevue'
     ],
     primevue: {
       cssLayerOrder: 'tailwind-base, primevue, tailwind-utilities',
       components: {
         include: ['Button', 'Card', /* other components */]
       },
       options: {
         unstyled: true,
         ripple: true,
         inputStyle: 'filled',
         pt: {}  // Required for Nuxt 3.12+
       }
     },
     router: {
       options: {
         strict: false  // Handle unknown paths gracefully
       }
     }
   })
   ```

3. **CSS Layer Ordering**
   - Tailwind base must load before PrimeVue
   - PrimeVue styles must load before Tailwind utilities
   - Use the `cssLayerOrder` option to manage this

4. **Common Issues & Solutions**

   a. **PT Configuration Error**
   ```
   [nuxt] Could not access 'pt'. The only available runtime config keys are 'public' and 'app'
   ```
   Solution: Move PT configuration from `runtimeConfig` to PrimeVue options:
   ```javascript
   primevue: {
     options: {
       pt: {}  // Place PT configuration here
     }
   }
   ```

   b. **Password Input Accessibility**
   For password forms, always include:
   - Hidden username field with `autocomplete="username"`
   - Proper autocomplete attributes on password fields:
     ```vue
     <Password
       :inputProps="{ autocomplete: 'current-password' }"
       // or 'new-password' for new password fields
     />
     ```

   c. **Style Conflicts**
   If Tailwind is overriding PrimeVue styles:
   ```javascript
   primevue: {
     cssLayerOrder: 'tailwind-base, primevue, tailwind-utilities'
   }
   ```

   d. **Component Loading Issues**
   Ensure components are explicitly included:
   ```javascript
   primevue: {
     components: {
       include: ['Button', 'Card', 'Password', /* etc */]
     }
   }
   ```

   e. **Vue Router Warnings**
   To handle unknown paths (including Chrome DevTools paths):
   1. Set `router.options.strict: false` in nuxt.config.js
   2. Create a catch-all route (`pages/[...slug].vue`):
      ```vue
      <template>
        <div class="min-h-screen flex items-center justify-center">
          <div class="text-center">
            <h1 class="text-4xl font-bold mb-4">404</h1>
            <p class="mb-8">Page not found</p>
            <NuxtLink to="/">
              <Button label="Go Home" icon="pi pi-home" />
            </NuxtLink>
          </div>
        </div>
      </template>
      ```

5. **Development Best Practices**
   - Always check browser console for configuration warnings
   - Use browser dev tools to inspect CSS layer ordering
   - Test form components with password managers enabled
   - Verify accessibility compliance with browser tools
   - Handle unknown routes gracefully with a catch-all route 

## 🔐 Google OAuth & Supabase Configuration (Local Debugging & Production)

This project supports Google OAuth login via Supabase in both local development and production (Vercel) environments. Follow these steps to ensure authentication works everywhere and is easy to debug.

### 1. Supabase Dashboard Settings

- **Site URL:** Set to your production site (e.g., `https://cogitations-reviews.vercel.app`).
- **Redirect URLs:** Add the following (wildcards recommended for flexibility):
  ```
  http://localhost:3000/**
  https://cogitations-reviews.vercel.app/**
  https://*-yourteam.vercel.app/**   # For Vercel preview deployments
  ```
  - **Why use wildcards?** Wildcards (`**`) allow all paths and subpaths, making it easier to support local development, production, and preview deployments without having to add each URL individually. This is especially useful for Vercel preview URLs, which change on every deploy.
  - See the [Supabase Docs: Redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls#wildcards-in-redirect-urls) for more details and examples.

### 2. Google Cloud Console OAuth Settings

- Go to [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials).
- Edit your OAuth 2.0 Client ID.
- **Authorized JavaScript origins:**
  - `http://localhost:3000`
  - `https://cogitations-reviews.vercel.app`
- **Authorized redirect URIs:**
  - `http://localhost:3000/auth/callback`
  - `https://cogitations-reviews.vercel.app/auth/callback`
  - (Add any other preview or staging URLs as needed. Wildcards are NOT supported here.)

### 3. Environment Variables

- **Local Development (`.env`):**
  ```
  NUXT_PUBLIC_SITE_URL=http://localhost:3000
  ```
- **Vercel Production:**
  - In the Vercel dashboard, set:
    ```
    NUXT_PUBLIC_SITE_URL=https://cogitations-reviews.vercel.app
    ```

### 4. Nuxt Runtime Config

Your `nuxt.config.js` should expose the site URL:
```js
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    }
  }
})
```

### 5. Using the Redirect in Code

Wherever you call Google OAuth, use:
```js
const config = useRuntimeConfig()
const redirectTo = `${config.public.siteUrl}/auth/callback` // or just `/` if you handle at root
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: { redirectTo }
})
```

### 6. Debugging Tips

- **To debug locally:**
  - Run `npm run dev`.
  - Make sure `.env` is set to `http://localhost:3000` and restart the dev server after changes.
  - Check the browser console for `NUXT_PUBLIC_SITE_URL` logs.
  - If you are redirected to production from localhost, double-check your `.env`, Supabase, and Google Cloud settings.
- **To debug on Vercel:**
  - Deploy with `vercel deploy --prebuilt --prod`.
  - Ensure the Vercel environment variable is set to your production URL.
  - Check the browser console for `NUXT_PUBLIC_SITE_URL` logs.
- **If you see a redirect to the wrong site:**
  - Make sure the exact callback URL is in both Supabase and Google Cloud settings.
  - Use wildcards in Supabase for flexibility, but not in Google Cloud.
  - Always restart your dev server after changing `.env`.

### 7. References
- [Supabase Docs: Redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls)
- [Supabase Docs: Troubleshooting Redirects](https://supabase.com/docs/guides/troubleshooting/why-am-i-being-redirected-to-the-wrong-url-when-using-auth-redirectto-option-_vqIeO)
- [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials)

---

**With this setup, you can debug Google OAuth locally with `npm run dev` and deploy to Vercel for production, with authentication working in both environments.** 