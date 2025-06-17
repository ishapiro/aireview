npm# Cogitations Reviews

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