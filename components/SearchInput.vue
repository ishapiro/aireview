<template>
  <div class="relative w-full">
    <!-- Search Input -->
    <div class="relative">
      <input
        v-model="localQuery"
        type="text"
        :placeholder="placeholder"
        class="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-l-lg sm:rounded-r-none border border-gray-200 focus:ring-2 focus:ring-primary-400 focus:outline-none text-base sm:text-lg"
        :class="{
          'border-red-300 focus:ring-red-400': hasSpellingErrors,
          'border-yellow-300 focus:ring-yellow-400': hasSuggestions
        }"
        @input="handleInput"
        @focus="showSuggestions = true"
        @blur="handleBlur"
        @keydown="handleKeydown"
      />
      
      <!-- Spell Check Indicator -->
      <!-- <div v-if="hasSpellingErrors" class="absolute right-3 top-1/2 transform -translate-y-1/2">
        <i class="pi pi-exclamation-triangle text-red-500 text-sm" title="Spelling errors detected"></i>
      </div> -->
    </div>

    <!-- Suggestions Dropdown -->
    <div
      v-if="showSuggestions && (searchSuggestions.length > 0 || spellingSuggestions.length > 0)"
      class="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
    >
      <!-- Search Suggestions -->
      <div v-if="searchSuggestions.length > 0" class="p-2">
        <div class="text-xs font-medium text-gray-500 px-2 py-1">Search Suggestions</div>
        <div
          v-for="(suggestion, index) in searchSuggestions"
          :key="`search-${index}`"
          class="px-2 py-2 hover:bg-gray-50 cursor-pointer rounded text-sm"
          :class="{ 'bg-gray-50': selectedIndex === index }"
          @click="applySearchSuggestion(suggestion)"
          @mouseenter="selectedIndex = index"
        >
          <i class="pi pi-search text-gray-400 mr-2"></i>
          {{ suggestion }}
        </div>
      </div>

      <!-- Spelling Suggestions -->
      <div v-if="spellingSuggestions.length > 0" class="p-2 border-t border-gray-100">
        <div class="text-xs font-medium text-gray-500 px-2 py-1">Spelling Suggestions</div>
        <div
          v-for="(suggestion, index) in spellingSuggestions"
          :key="`spell-${index}`"
          class="px-2 py-2 hover:bg-gray-50 cursor-pointer rounded text-sm"
          :class="{ 'bg-gray-50': selectedIndex === searchSuggestions.length + index }"
          @click="applySpellingSuggestion(suggestion)"
          @mouseenter="selectedIndex = searchSuggestions.length + index"
        >
          <i class="pi pi-check-circle text-green-500 mr-2"></i>
          <span class="text-red-500 line-through">{{ suggestion.originalWord }}</span>
          <span class="text-gray-600"> → </span>
          <span class="text-green-600 font-medium">{{ suggestion.correctedWord }}</span>
        </div>
      </div>
    </div>

    <!-- Spell Check Error -->
    <div v-if="spellCheck.error" class="text-xs text-red-500 mt-1">
      {{ spellCheck.error }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { useSpellCheck } from '~/composables/useSpellCheck'
import { useCategories } from '~/composables/useCategories'
import { useSupabaseClient } from '#imports'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Search for a product or category...'
  },
  categories: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'search'])

const spellCheck = useSpellCheck()
const { data: allCategories } = useCategories()
const client = useSupabaseClient()

const localQuery = ref(props.modelValue)
const showSuggestions = ref(false)
const selectedIndex = ref(0)
const debounceTimer = ref(null)

// Dynamic words from DB
const dynamicWords = ref([])

onMounted(async () => {
  // Fetch categories
  let categoryNames = []
  if (allCategories.value) {
    categoryNames = allCategories.value.map(cat => cat.name)
  }
  // Fetch product names (review titles)
  let productNames = []
  try {
    const { data: reviews } = await client.from('reviews').select('title')
    productNames = (reviews || []).map(r => r.title)
  } catch (e) {
    // ignore
  }
  dynamicWords.value = [...categoryNames, ...productNames]
})

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
  localQuery.value = newValue
})

// Watch for local changes and emit updates
watch(localQuery, (newValue) => {
  emit('update:modelValue', newValue)
})

// Get categories for suggestions (use props or fetch from composable)
const categories = computed(() => {
  return props.categories.length > 0 ? props.categories : (allCategories.value || [])
})

// Combine static and dynamic words for suggestions and spell check
const combinedWordList = computed(() => {
  return Array.from(new Set([
    ...Array.from(spellCheck.dictionary.value || []),
    ...dynamicWords.value
  ]))
})

// Check for spelling errors
const spellingResult = computed(() => {
  if (!localQuery.value || spellCheck.isLoading.value) {
    return { misspelled: [], suggestions: {} }
  }
  // Use combinedWordList for spell checking
  return spellCheck.checkQuery(localQuery.value, combinedWordList.value)
})

// Get search suggestions
const searchSuggestions = computed(() => {
  if (!localQuery.value || localQuery.value.length < 2) return []
  const query = localQuery.value.toLowerCase()
  return combinedWordList.value
    .filter(word => word && word.toLowerCase().startsWith(query))
    .slice(0, 8)
})

// Format spelling suggestions
const spellingSuggestions = computed(() => {
  const suggestions = []
  spellingResult.value.misspelled.forEach(word => {
    const wordSuggestions = spellingResult.value.suggestions[word] || []
    wordSuggestions.forEach(suggestion => {
      suggestions.push({
        originalWord: word,
        correctedWord: suggestion
      })
    })
  })
  return suggestions.slice(0, 5) // Limit to 5 suggestions
})

// Check if there are spelling errors
const hasSpellingErrors = computed(() => {
  return spellingResult.value.misspelled.length > 0
})

// Check if there are any suggestions
const hasSuggestions = computed(() => {
  return searchSuggestions.value.length > 0 || spellingSuggestions.value.length > 0
})

// Handle input changes with debouncing
const handleInput = () => {
  clearTimeout(debounceTimer.value)
  debounceTimer.value = setTimeout(() => {
    // Trigger spell check and suggestions
    showSuggestions.value = true
    selectedIndex.value = 0
  }, 300)
}

// Handle blur event
const handleBlur = () => {
  setTimeout(() => {
    showSuggestions.value = false
    selectedIndex.value = 0
  }, 200)
}

// Handle keyboard navigation
const handleKeydown = (event) => {
  const totalSuggestions = searchSuggestions.value.length + spellingSuggestions.value.length
  
  if (totalSuggestions === 0) return

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      selectedIndex.value = (selectedIndex.value + 1) % totalSuggestions
      break
    case 'ArrowUp':
      event.preventDefault()
      selectedIndex.value = selectedIndex.value === 0 ? totalSuggestions - 1 : selectedIndex.value - 1
      break
    case 'Enter':
      event.preventDefault()
      if (selectedIndex.value < searchSuggestions.value.length) {
        applySearchSuggestion(searchSuggestions.value[selectedIndex.value])
      } else {
        const spellingIndex = selectedIndex.value - searchSuggestions.value.length
        applySpellingSuggestion(spellingSuggestions.value[spellingIndex])
      }
      break
    case 'Escape':
      showSuggestions.value = false
      selectedIndex.value = 0
      break
  }
}

// Apply search suggestion
const applySearchSuggestion = (suggestion) => {
  localQuery.value = suggestion
  showSuggestions.value = false
  emit('search', suggestion)
}

// Apply spelling suggestion
const applySpellingSuggestion = (suggestion) => {
  const regex = new RegExp(`\\b${suggestion.originalWord}\\b`, 'gi')
  localQuery.value = localQuery.value.replace(regex, suggestion.correctedWord)
  showSuggestions.value = false
  emit('search', localQuery.value)
}
</script> 