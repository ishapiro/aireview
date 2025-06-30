import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

export interface BreadcrumbItem {
  label: string
  to?: string
  icon?: string
}

export function useBreadcrumbs() {
  const route = useRoute()
  const dynamicBreadcrumbs = ref<BreadcrumbItem[]>([])
  
  const breadcrumbs = computed(() => {
    const items: BreadcrumbItem[] = [
      {
        label: 'Home',
        to: '/',
        icon: 'pi pi-home'
      }
    ]

    // Use dynamic breadcrumbs if set, otherwise fall back to route-based logic
    if (dynamicBreadcrumbs.value.length > 0) {
      items.push(...dynamicBreadcrumbs.value)
    } else {
      // Get breadcrumb from route meta
      const routeBreadcrumb = route.meta?.breadcrumb
      if (routeBreadcrumb) {
        if (typeof routeBreadcrumb === 'string') {
          items.push({
            label: routeBreadcrumb,
            to: route.path
          })
        } else if (Array.isArray(routeBreadcrumb)) {
          items.push(...routeBreadcrumb)
        }
      } else {
        // Handle dynamic routes based on path
        const pathSegments = route.path.split('/').filter(Boolean)
        
        if (pathSegments.length > 0) {
          // Handle specific route patterns
          if (pathSegments[0] === 'reviews' && pathSegments[1]) {
            // Reviews page - we'll need to fetch the review title
            items.push({
              label: 'Reviews',
              to: '/reviews'
            })
            // The actual review title will be set by the page component
          } else if (pathSegments[0] === 'categories' && pathSegments[1]) {
            // Categories page
            items.push({
              label: 'Categories',
              to: '/categories-all'
            })
            // The actual category name will be set by the page component
          } else if (pathSegments[0] === 'admin') {
            items.push({
              label: 'Admin',
              to: '/admin'
            })
            
            if (pathSegments[1] === 'reviews') {
              items.push({
                label: 'Reviews',
                to: '/admin/reviews'
              })
              
              if (pathSegments[2] === 'new') {
                items.push({
                  label: 'New Review'
                })
              } else if (pathSegments[2]) {
                items.push({
                  label: 'Edit Review'
                })
              }
            } else if (pathSegments[1] === 'categories') {
              items.push({
                label: 'Categories',
                to: '/admin/categories'
              })
            }
          } else if (pathSegments[0] === 'auth') {
            if (pathSegments[1] === 'login') {
              items.push({
                label: 'Sign In'
              })
            } else if (pathSegments[1] === 'register') {
              items.push({
                label: 'Sign Up'
              })
            } else if (pathSegments[1] === 'verify-email') {
              items.push({
                label: 'Verify Email'
              })
            }
          } else if (pathSegments[0] === 'search') {
            items.push({
              label: 'Search'
            })
          } else if (pathSegments[0] === 'profile') {
            items.push({
              label: 'Profile'
            })
          } else if (pathSegments[0] === 'saved-lists') {
            items.push({
              label: 'Saved Lists'
            })
          }
        }
      }
    }

    return items
  })

  const setBreadcrumbs = (breadcrumbs: BreadcrumbItem[]) => {
    dynamicBreadcrumbs.value = breadcrumbs
  }

  const setBreadcrumb = (index: number, breadcrumb: BreadcrumbItem) => {
    if (index >= 0 && index < dynamicBreadcrumbs.value.length) {
      dynamicBreadcrumbs.value[index] = breadcrumb
    }
  }

  const clearDynamicBreadcrumbs = () => {
    dynamicBreadcrumbs.value = []
  }

  // Clear dynamic breadcrumbs when route changes
  watch(() => route.path, () => {
    clearDynamicBreadcrumbs()
  })

  return {
    breadcrumbs,
    setBreadcrumbs,
    setBreadcrumb,
    clearDynamicBreadcrumbs
  }
} 