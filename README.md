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

1. Create a new Supabase project at [https://app.supabase.com](https://app.supabase.com)
2. Get your project URL and anon key from Project Settings > API
3. Create a `.env` file in the root directory:

```env
SUPABASE_URL=your-project-url
SUPABASE_KEY=your-anon-key
```

4. Initialize the database schema:
   - Navigate to the SQL editor in your Supabase dashboard
   - Copy the contents of `supabase/schema.sql`
   - Execute the SQL commands to set up your database schema

5. Set up Google OAuth (for Google Sign-In):
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

### 4. Development Server

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

### 5. Production Build

```bash
npm run build
# or
yarn build
```

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

5. **Development Best Practices**
   - Always check browser console for configuration warnings
   - Use browser dev tools to inspect CSS layer ordering
   - Test form components with password managers enabled
   - Verify accessibility compliance with browser tools 