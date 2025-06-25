<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold text-gray-900">My Saved Lists</h1>
      <Button
        v-if="!isLoading && savedLists.length > 0"
        @click="showCreateDialog = true"
        label="Create New List"
        icon="pi pi-plus"
      />
    </div>

    <!-- Empty State -->
    <div v-if="savedLists.length === 0 && !isLoading" class="text-center py-16">
      <div class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <i class="pi pi-bookmark text-6xl text-gray-300 mb-4"></i>
        <h3 class="text-xl font-medium text-gray-900 mb-2">No saved lists yet</h3>
        <p class="text-gray-500 mb-6">
          Create lists to organize your favorite reviews and easily find them later.
        </p>
        <Button @click="showCreateDialog = true" label="Create Your First List" icon="pi pi-plus" size="large" />
      </div>
    </div>

    <!-- Lists Grid -->
    <div v-else-if="!isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="list in savedLists" :key="list.list_id" class="h-96 flex flex-col min-h-0">
        <Card
          class="shadow-md hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden flex-1 flex flex-col min-h-0"
          :pt="{ header: { class: 'p-0' }, content: { class: 'p-4 flex-1 flex flex-col min-h-0' } }"
        >
          <template #header>
            <div class="flex items-center justify-between px-4 py-3 border-b bg-gray-50 min-h-[60px]">
              <h3 class="text-sm font-semibold text-gray-800 mr-3 flex-1 min-w-0 line-clamp-2">{{ list.list_name }}</h3>
              <div class="flex items-center space-x-2 flex-shrink-0">
                <span class="text-xs text-gray-600 font-medium">{{ list.item_count }} items</span>
                <i
                  @click="deleteList(list.list_id)"
                  class="pi pi-trash text-red-500 font-bold cursor-pointer text-sm hover:text-red-700 transition-colors"
                  v-tooltip.top="'Delete List'"
                ></i>
              </div>
            </div>
          </template>
          
          <template #content>
            <div class="flex flex-col flex-1 min-h-0">
              <p class="text-xs text-gray-500 mb-2">
                Created {{ formatDate(list.created_at) }}
              </p>
              <div v-if="list.items && list.items.length > 0" class="overflow-y-auto space-y-2" style="max-height: 140px;">
                <div
                  v-for="item in list.items"
                  :key="item.id"
                  class="flex items-center space-x-2 p-2 bg-white border rounded-md hover:bg-gray-50 transition-colors"
                >
                  <div class="flex-1 min-w-0">
                    <NuxtLink :to="`/reviews/${item.slug}`" class="text-xs font-medium text-gray-900 truncate hover:text-primary-600 block">{{ item.title }}</NuxtLink>
                  </div>
                  <div class="flex items-center space-x-1">
                    <span v-for="star in 5" :key="star">
                      <i
                        class="text-xs"
                        :class="star <= item.rating ? 'pi pi-star-fill text-yellow-400' : 'pi pi-star text-gray-300'"
                      ></i>
                    </span>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-6 bg-gray-50 rounded-md flex-1 flex items-center justify-center">
                <div>
                  <i class="pi pi-inbox text-2xl text-gray-400 mb-2"></i>
                  <p class="text-xs text-gray-600">No items in this list yet</p>
                </div>
              </div>
            </div>
          </template>
        </Card>
        <!-- Action buttons below the card -->
        <div class="flex justify-between space-x-2 bg-gray-50 rounded-b-lg shadow-md px-4 py-2 mt-0.5">
          <Button
            @click="viewList(list)"
            label="Details"
            icon="pi pi-list"
            size="small"
            class="flex-1 text-xs"
          />
          <NuxtLink :to="{ path: '/search', query: { list: list.list_id, listName: list.list_name } }" class="w-full flex-1">
            <Button
              as="span"
              label="Add"
              icon="pi pi-plus"
              size="small"
              severity="secondary"
              class="w-full text-xs"
            />
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <i class="pi pi-spin pi-spinner text-4xl text-gray-400"></i>
    </div>

    <!-- Create List Dialog -->
    <Dialog
      v-model:visible="showCreateDialog"
      modal
      header="Create New List"
      :style="{ width: '400px' }"
    >
      <div class="space-y-4">
        <div>
          <label for="list-name" class="block text-sm font-medium text-gray-700 mb-2">
            List Name
          </label>
          <InputText
            id="list-name"
            v-model="newListName"
            placeholder="Enter a name for your list"
            class="w-full"
            :disabled="isCreating"
          />
        </div>
      </div>
      
      <template #footer>
        <div class="flex justify-end space-x-2">
          <Button
            @click="showCreateDialog = false"
            label="Cancel"
            text
            :disabled="isCreating"
          />
          <Button
            @click="createList"
            label="Create List"
            :loading="isCreating"
            :disabled="!newListName.trim()"
          />
        </div>
      </template>
    </Dialog>

    <!-- View List Dialog -->
    <Dialog
      v-model:visible="showViewDialog"
      modal
      :header="selectedList?.list_name"
      :style="{ width: '80vw', maxWidth: '800px' }"
    >
      <div v-if="selectedList" class="space-y-4">
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-500">
            {{ selectedList.item_count }} items • Created {{ formatDate(selectedList.created_at) }}
          </p>
        </div>
        <div v-if="selectedList.items && selectedList.items.length > 0" class="space-y-3">
          <div 
            v-for="item in selectedList.items" 
            :key="item.id"
            class="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
          >
            <!-- Checkbox for selection -->
            <div class="flex items-center space-x-3 flex-1">
              <Checkbox
                v-model="selectedItems"
                :value="item.id"
                :disabled="selectedItems.length >= 3 && !selectedItems.includes(item.id)"
                class="flex-shrink-0"
              />
              <div class="flex-1 min-w-0">
                <h4 class="font-medium text-gray-900">{{ item.title }}</h4>
                <p class="text-sm text-gray-500 mt-1">{{ item.summary }}</p>
                <div class="flex items-center space-x-4 mt-2">
                  <div class="flex items-center space-x-1">
                    <span v-for="star in 5" :key="star">
                      <i
                        class="text-xs"
                        :class="star <= item.rating ? 'pi pi-star-fill text-yellow-400' : 'pi pi-star text-gray-300'"
                      ></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-2 ml-4">
              <NuxtLink 
                :to="`/reviews/${item.slug}`"
                class="text-primary-600 hover:text-primary-900 text-sm"
              >
                View Review
              </NuxtLink>
              <i
                @click="removeFromList(selectedList.list_id, item.id)"
                class="pi pi-trash text-red-500 font-bold cursor-pointer"
                v-tooltip.top="'Remove from list'"
              ></i>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8">
          <i class="pi pi-bookmark text-4xl text-gray-300 mb-4"></i>
          <p class="text-gray-500">This list is empty</p>
        </div>
      </div>
      
      <template #footer>
        <div class="flex justify-end space-x-2 w-full">
          <Button
            v-if="selectedItems.length >= 2 && selectedItems.length <= 3"
            @click="compareSelectedItems"
            label="Compare"
            icon="pi pi-chart-bar"
            size="small"
            :loading="isComparing"
            :disabled="selectedItems.length < 2 || selectedItems.length > 3"
          />
          <Button
            @click="showViewDialog = false"
            label="Close"
          />
        </div>
      </template>
    </Dialog>

    <!-- Comparison Result Dialog -->
    <Dialog
      v-model:visible="showComparisonDialog"
      modal
      header="Product Comparison"
      :style="{ width: '90vw', maxWidth: '1000px' }"
    >
      <div v-if="comparisonResult" class="space-y-4">
        <div class="prose prose-sm max-w-none" v-html="renderedComparisonResult"></div>
      </div>
      
      <div v-else-if="isComparing" class="flex justify-center items-center py-12">
        <div class="text-center">
          <i class="pi pi-spin pi-spinner text-4xl text-gray-400 mb-4"></i>
          <p class="text-gray-600">Generating comparison...</p>
        </div>
      </div>
      
      <template #footer>
        <div class="flex justify-end">
          <Button
            @click="showComparisonDialog = false"
            label="Close"
          />
        </div>
      </template>
    </Dialog>

    <Toast />
    <ConfirmDialog />
  </div>
</template>

<script setup>
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { format } from 'date-fns'
import { marked } from 'marked'
import { useAI } from '@/composables/useAI'

const client = useSupabaseClient()
const user = useSupabaseUser()
const toast = useToast()
const confirm = useConfirm()
const { sendAIPrompt } = useAI()

// State
const savedLists = ref([])
const isLoading = ref(true)
const isCreating = ref(false)
const showCreateDialog = ref(false)
const showViewDialog = ref(false)
const showComparisonDialog = ref(false)
const newListName = ref('')
const selectedList = ref(null)
const selectedItems = ref([])
const isComparing = ref(false)
const comparisonResult = ref(null)

// Computed property to render comparison result as HTML
const renderedComparisonResult = computed(() => {
  if (!comparisonResult.value) return ''
  return marked(comparisonResult.value)
})

// Fetch saved lists
const fetchSavedLists = async () => {
  if (!user.value) return
  
  isLoading.value = true
  try {
    const { data, error } = await client.rpc('get_user_saved_lists')
    
    if (error) throw error
    
    savedLists.value = data || []
  } catch (error) {
    console.error('Error fetching saved lists:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load your saved lists',
      life: 3000
    })
  } finally {
    isLoading.value = false
  }
}

// Create new list
const createList = async () => {
  if (!newListName.value.trim()) return
  
  isCreating.value = true
  try {
    const { data, error } = await client.rpc('create_saved_list', {
      list_name: newListName.value.trim()
    })
    
    if (error) throw error
    
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'List created successfully',
      life: 3000
    })
    
    showCreateDialog.value = false
    newListName.value = ''
    await fetchSavedLists()
  } catch (error) {
    console.error('Error creating list:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to create list',
      life: 3000
    })
  } finally {
    isCreating.value = false
  }
}

// Delete list
const deleteList = (listId) => {
  confirm.require({
    message: 'Are you sure you want to delete this list? This action cannot be undone.',
    header: 'Confirm Deletion',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-info',
    accept: async () => {
      try {
        const { error } = await client.rpc('delete_saved_list', {
          p_list_id: listId
        })
        
        if (error) throw error
        
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'List deleted successfully',
          life: 3000
        })
        
        await fetchSavedLists()
      } catch (error) {
        console.error('Error deleting list:', error)
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete list',
          life: 3000
        })
      }
    }
  })
}

// View list details
const viewList = (list) => {
  selectedList.value = list
  selectedItems.value = []
  showViewDialog.value = true
}

// Remove item from list
const removeFromList = async (listId, reviewId) => {
  try {
    const { error } = await client.rpc('remove_from_saved_list', {
      p_list_id: listId,
      p_review_id: reviewId
    })
    
    if (error) throw error
    
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Item removed from list',
      life: 3000
    })
    
    // Refresh the selected list
    const { data } = await client.rpc('get_user_saved_lists')
    if (data) {
      selectedList.value = data.find(list => list.list_id === listId)
    }
    
    // Refresh the main list
    await fetchSavedLists()
  } catch (error) {
    console.error('Error removing item from list:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to remove item from list',
      life: 3000
    })
  }
}

// Format date
const formatDate = (date) => {
  if (!date) return 'Unknown'
  return format(new Date(date), 'MMM d, yyyy')
}

// Compare selected items
const compareSelectedItems = async () => {
  if (selectedItems.value.length < 2 || selectedItems.value.length > 3) return

  isComparing.value = true
  try {
    // Get the selected product titles
    const products = selectedList.value.items.filter(item => selectedItems.value.includes(item.id)).map(item => item.title)
    const productTitles = products.join(', ')
    const prompt = `Compare: ${productTitles}`

    // Use shared composable
    comparisonResult.value = await sendAIPrompt(prompt)
    showComparisonDialog.value = true
  } catch (error) {
    console.error('Error comparing items:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to compare items',
      life: 3000
    })
  } finally {
    isComparing.value = false
  }
}

// Fetch lists on mount
onMounted(() => {
  fetchSavedLists()
})

// Watch for user changes
watch(user, (newUser) => {
  if (newUser) {
    fetchSavedLists()
  } else {
    savedLists.value = []
  }
})

// Watch for dialog close to reset selected items
watch(showViewDialog, (newValue) => {
  if (!newValue) {
    selectedItems.value = []
    comparisonResult.value = null
  }
})
</script> 