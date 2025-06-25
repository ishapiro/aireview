import { useRuntimeConfig } from '#imports'

export function useAmazon() {
  // Search for products on Amazon using server-side API
  const searchProducts = async (searchTerm, searchIndex = 'All') => {
    try {
      console.log('[useAmazon] Starting search for:', searchTerm)
      
      const response = await $fetch('/api/amazon/lookup', {
        method: 'POST',
        body: {
          searchTerm,
          searchIndex
        }
      })
      
      console.log('[useAmazon] Search completed successfully')
      return response
    } catch (error) {
      console.error('[useAmazon] Search error:', error)
      
      // Check if it's a 404 error (API endpoint not found)
      if (error.status === 404) {
        console.error('[useAmazon] API endpoint not found. This might be a server configuration issue.')
        throw new Error('Amazon API endpoint not available. Please try again later.')
      }
      
      // Check if it's an Amazon API error
      if (error.status >= 400 && error.status < 500) {
        throw new Error(`Amazon API error: ${error.data?.statusMessage || error.message}`)
      }
      
      // Generic error
      throw new Error('Failed to search Amazon products. Please try again.')
    }
  }
  
  // Generate Amazon affiliate link (this will be handled server-side now)
  const generateAffiliateLink = (asin) => {
    // This function is kept for backward compatibility but affiliate links
    // are now generated server-side with the proper partner tag
    return `https://www.amazon.com/dp/${asin}`
  }
  
  return {
    searchProducts,
    generateAffiliateLink
  }
} 