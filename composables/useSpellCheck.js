import { ref, computed } from 'vue'
import didYouMean from 'didyoumean2'

export const useSpellCheck = () => {
  const dictionary = ref(new Set())
  const isLoading = ref(true)
  const error = ref(null)

  // Initialize the spell checker with a custom word list
  const initSpellChecker = async () => {
    try {
      isLoading.value = true
      // Fetch the word list from public/words_en_us.txt
      const res = await fetch('/words_en_us.txt')
      const text = await res.text()
      text.split('\n').forEach(word => {
        if (word.trim().length > 0) {
          dictionary.value.add(word.trim().toLowerCase())
        }
      })
      // Add common product-related terms to the dictionary
      const productTerms = [
        'laptop', 'computer', 'smartphone', 'phone', 'tablet', 'headphones', 'speaker', 'camera', 'television', 'tv',
        'monitor', 'keyboard', 'mouse', 'printer', 'scanner', 'router', 'modem', 'charger', 'battery', 'cable',
        'wireless', 'bluetooth', 'wifi', 'usb', 'hdmi', 'ethernet', 'vga', 'displayport',
        'furniture', 'chair', 'table', 'sofa', 'bed', 'mattress', 'lamp', 'light', 'fan', 'heater', 'air conditioner',
        'refrigerator', 'fridge', 'microwave', 'oven', 'stove', 'dishwasher', 'washing machine', 'dryer', 'vacuum',
        'blender', 'mixer', 'coffee maker', 'toaster', 'kettle', 'pan', 'pot', 'knife', 'utensil',
        'shirt', 'pants', 'jeans', 'dress', 'skirt', 'jacket', 'coat', 'sweater', 'hoodie', 'sneakers', 'shoes',
        'boots', 'sandals', 'hat', 'cap', 'scarf', 'gloves', 'socks', 'underwear', 'bra', 'pajamas',
        'shampoo', 'conditioner', 'soap', 'lotion', 'cream', 'makeup', 'cosmetics', 'perfume', 'cologne', 'deodorant',
        'toothbrush', 'toothpaste', 'razor', 'shaving', 'hair dryer', 'curling iron', 'straightener', 'mirror',
        'bicycle', 'bike', 'treadmill', 'dumbbell', 'yoga mat', 'tent', 'sleeping bag', 'backpack', 'hiking boots',
        'fishing rod', 'golf club', 'tennis racket', 'basketball', 'football', 'soccer ball', 'baseball', 'bat',
        'book', 'novel', 'magazine', 'newspaper', 'dvd', 'bluray', 'cd', 'vinyl', 'record', 'poster', 'calendar',
        'toy', 'game', 'puzzle', 'board game', 'video game', 'console', 'controller', 'doll', 'action figure',
        'building blocks', 'lego', 'card game', 'chess', 'checkers',
        'car', 'truck', 'suv', 'sedan', 'hatchback', 'convertible', 'tire', 'oil', 'filter', 'battery', 'brake',
        'engine', 'transmission', 'radiator', 'alternator', 'starter', 'ignition', 'fuel', 'gas', 'diesel',
        'best', 'top', 'quality', 'premium', 'affordable', 'cheap', 'expensive', 'durable', 'reliable', 'fast',
        'slow', 'light', 'heavy', 'small', 'large', 'big', 'tiny', 'compact', 'portable', 'waterproof',
        'shockproof', 'dustproof', 'noise cancelling', 'gaming', 'professional', 'budget', 'performance',
        'apple', 'samsung', 'sony', 'lg', 'panasonic', 'philips', 'bosch', 'whirlpool', 'maytag', 'kenmore',
        'nike', 'adidas', 'puma', 'reebok', 'under armour', 'levi', 'calvin klein', 'ralph lauren',
        'dell', 'hp', 'lenovo', 'asus', 'acer', 'msi', 'razer', 'logitech', 'corsair', 'steel series'
      ]
      productTerms.forEach(term => dictionary.value.add(term.toLowerCase()))
      error.value = null
    } catch (err) {
      console.error('Failed to load spell checker dictionary:', err)
      error.value = 'Failed to load spell checker'
    } finally {
      isLoading.value = false
    }
  }

  // Check if a word is spelled correctly
  const isSpelledCorrectly = (word) => {
    if (!dictionary.value || !word) return true
    
    // Skip very short words, numbers, and special characters
    if (word.length <= 2 || /^\d+$/.test(word) || /^[^\w\s]+$/.test(word)) {
      return true
    }
    
    return dictionary.value.has(word.toLowerCase())
  }

  // Get spelling suggestions for a word using didyoumean2
  const getSuggestions = (word, limit = 5) => {
    if (!dictionary.value || !word || word.length <= 2) return []
    
    try {
      const suggestions = didYouMean(word, Array.from(dictionary.value), {
        matchPath: [],
        threshold: 0.6,
        caseSensitive: false
      })
      
      return Array.isArray(suggestions) ? suggestions.slice(0, limit) : []
    } catch (err) {
      console.error('Error getting suggestions for:', word, err)
      return []
    }
  }

  // Check entire query and return misspelled words with suggestions
  const checkQuery = (query) => {
    if (!query || !dictionary.value) return { misspelled: [], suggestions: {} }
    
    const words = query.split(/\s+/).filter(word => word.length > 0)
    const misspelled = []
    const suggestions = {}
    
    words.forEach(word => {
      const cleanWord = word.replace(/[^\w]/g, '')
      if (cleanWord.length > 2 && !isSpelledCorrectly(cleanWord)) {
        misspelled.push(word)
        suggestions[word] = getSuggestions(cleanWord)
      }
    })
    
    return { misspelled, suggestions }
  }

  // Get search suggestions based on categories and common terms
  const getSearchSuggestions = (query, categories = []) => {
    if (!query || query.length < 2) return []
    
    const suggestions = new Set()
    const queryLower = query.toLowerCase()
    
    // Add category suggestions
    categories.forEach(category => {
      if (category.name.toLowerCase().includes(queryLower)) {
        suggestions.add(category.name)
      }
      if (category.description && category.description.toLowerCase().includes(queryLower)) {
        const matchingWords = category.description.split(' ').filter(word => 
          word.toLowerCase().includes(queryLower)
        )
        matchingWords.forEach(word => suggestions.add(word))
      }
    })
    
    // Add common product-related terms
    const commonTerms = [
      'laptop', 'phone', 'headphones', 'camera', 'tablet', 'smartphone',
      'wireless', 'bluetooth', 'gaming', 'professional', 'budget', 'premium',
      'reviews', 'ratings', 'best', 'top', 'quality', 'performance',
      'computer', 'monitor', 'keyboard', 'mouse', 'speaker', 'television'
    ]
    
    commonTerms.forEach(term => {
      if (term.includes(queryLower)) {
        suggestions.add(term)
      }
    })
    
    return Array.from(suggestions).slice(0, 8)
  }

  // Initialize on import (but only on client side for Nuxt 3)
  if (process.client) {
    initSpellChecker()
  }

  return {
    isLoading,
    error,
    isSpelledCorrectly,
    getSuggestions,
    checkQuery,
    getSearchSuggestions,
    initSpellChecker,
    dictionary
  }
} 