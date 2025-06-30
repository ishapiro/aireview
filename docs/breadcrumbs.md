# Breadcrumb System

This document describes the breadcrumb implementation in our Nuxt 3 application.

## Overview

The breadcrumb system provides automatic navigation context for users, showing their current location within the site hierarchy. It's built using a composable pattern that allows for both automatic and manual breadcrumb generation.

## Architecture

### Components

1. **`composables/useBreadcrumbs.ts`** - Core logic for managing breadcrumbs
2. **`components/Breadcrumbs.vue`** - Reusable breadcrumb component
3. **`layouts/default.vue`** - Layout that includes the breadcrumb component

### Key Features

- **Automatic Route Detection**: Breadcrumbs are automatically generated based on the current route
- **Dynamic Content**: Pages can set custom breadcrumbs programmatically
- **Meta-based Configuration**: Pages can define breadcrumbs in their `definePageMeta()`
- **Accessibility**: Proper ARIA labels and semantic HTML
- **Mobile Responsive**: Works well on all screen sizes

## Usage

### Basic Usage (Automatic)

Most pages don't need any additional configuration. The system automatically generates breadcrumbs based on the route path:

```vue
<script setup>
definePageMeta({
  layout: 'default',
  name: 'My Page',
  breadcrumb: 'My Page' // Optional: custom breadcrumb label
})
</script>
```

### Dynamic Breadcrumbs

For pages with dynamic content (like review titles or category names), use the `useBreadcrumbs` composable:

```vue
<script setup>
import { useBreadcrumbs } from '~/composables/useBreadcrumbs'

const { setBreadcrumbs } = useBreadcrumbs()

// Set breadcrumbs when data is loaded
watch(review, (newReview) => {
  if (newReview) {
    setBreadcrumbs([
      {
        label: 'Reviews',
        to: '/reviews'
      },
      {
        label: newReview.title || 'Review'
      }
    ])
  }
}, { immediate: true })
</script>
```

### Complex Breadcrumb Structures

For admin pages or complex hierarchies:

```vue
<script setup>
const { setBreadcrumbs } = useBreadcrumbs()

setBreadcrumbs([
  {
    label: 'Admin',
    to: '/admin'
  },
  {
    label: 'Reviews',
    to: '/admin/reviews'
  },
  {
    label: 'Edit Review'
  }
])
</script>
```

## API Reference

### useBreadcrumbs Composable

#### Properties

- `breadcrumbs` (computed) - Current breadcrumb items

#### Methods

- `setBreadcrumbs(items: BreadcrumbItem[])` - Set custom breadcrumbs
- `setBreadcrumb(index: number, item: BreadcrumbItem)` - Update specific breadcrumb
- `clearDynamicBreadcrumbs()` - Clear custom breadcrumbs

### BreadcrumbItem Interface

```typescript
interface BreadcrumbItem {
  label: string      // Display text
  to?: string        // Optional link URL
  icon?: string      // Optional icon class
}
```

## Route Patterns

The system automatically handles these route patterns:

- `/reviews/[slug]` → Home → Reviews → [Review Title]
- `/categories/[slug]` → Home → Categories → [Category Name]
- `/admin/reviews/[id]` → Home → Admin → Reviews → [Review Title]
- `/admin/reviews/new` → Home → Admin → Reviews → New Review
- `/auth/login` → Home → Sign In
- `/search` → Home → Search

## Examples

### Review Page
```vue
<script setup>
const { setBreadcrumbs } = useBreadcrumbs()

watch(review, (newReview) => {
  if (newReview) {
    setBreadcrumbs([
      { label: 'Reviews', to: '/reviews' },
      { label: newReview.title }
    ])
  }
}, { immediate: true })
</script>
```

### Category Page
```vue
<script setup>
const { setBreadcrumbs } = useBreadcrumbs()

watch(category, (newCategory) => {
  if (newCategory) {
    setBreadcrumbs([
      { label: 'Categories', to: '/categories-all' },
      { label: newCategory.name }
    ])
  }
}, { immediate: true })
</script>
```

### Admin Page
```vue
<script setup>
definePageMeta({
  middleware: ['auth-admin'],
  breadcrumb: 'Admin Dashboard'
})
</script>
```

## Testing

Visit `/breadcrumb-example` to see the breadcrumb system in action and test different scenarios.

## Best Practices

1. **Use descriptive labels**: Make breadcrumb labels clear and user-friendly
2. **Include navigation links**: Always provide `to` properties for clickable breadcrumbs
3. **Handle loading states**: Set breadcrumbs after data is loaded
4. **Keep it simple**: Don't create overly complex breadcrumb hierarchies
5. **Test accessibility**: Ensure breadcrumbs work with screen readers

## Troubleshooting

### Breadcrumbs not showing
- Check that the page uses the `default` layout
- Verify that `definePageMeta()` is properly configured
- Ensure the route is not excluded from breadcrumb generation

### Dynamic breadcrumbs not updating
- Make sure to call `setBreadcrumbs()` after data is loaded
- Use `watch()` with `immediate: true` for initial data
- Check that the composable is properly imported

### Custom breadcrumbs not working
- Verify the `BreadcrumbItem` interface is followed
- Ensure `to` properties are valid routes
- Check that `setBreadcrumbs()` is called with the correct parameters 