import { useRuntimeConfig } from '#imports'

export function useAmazon() {
  // Amazon PA-API credentials from environment variables
  const accessKey = "AKIAION5E3UKLCLTSXIQ"
  const secretKey = "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"
  const partnerTag = "drvax-20"
  
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
  
  // Generate Amazon affiliate link
  const generateAffiliateLink = (asin) => {
    return `https://www.amazon.com/dp/${asin}?tag=${partnerTag}`
  }
  
  return {
    searchProducts,
    generateAffiliateLink
  }
} 