<template>
  <div>
    <!-- Save Button -->
    <Button
      @click="showDialog = true"
      :icon="isSaved ? 'pi pi-bookmark-fill' : 'pi pi-bookmark'"
      :label="isSaved ? 'Saved' : 'Save'"
      :severity="isSaved ? 'info' : 'primary'"
      size="small"
    />

    <!-- Save Dialog -->
    <Dialog
      v-model:visible="showDialog"
      modal
      header="Save to List"
      :style="{ width: '500px' }"
    >
      <div class="space-y-4">
        <!-- Existing Lists -->
        <div v-if="userLists.length > 0">
          <h3 class="text-sm font-medium text-gray-900 mb-3">Save to existing list:</h3>
          <div class="space-y-2 max-h-40 overflow-y-auto">
            <div
              v-for="list in userLists"
              :key="list.list_id"
              class="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
            >
              <div class="flex-1">
                <h4 class="font-medium text-gray-900">{{ list.list_name }}</h4>
                <p class="text-sm text-gray-500">{{ list.item_count }} items</p>
              </div>
              <Button
                @click="saveToList(list.list_id)"
                :label="isInList(list.list_id) ? 'Remove' : 'Add'"
                size="small"
                :loading="savingListId === list.list_id"
              />
            </div>
          </div>
        </div>

        <!-- Divider -->
        <div v-if="userLists.length > 0" class="border-t pt-4">
          <p class="text-sm text-gray-500 mb-3">Or create a new list:</p>
        </div>

        <!-- Create New List -->
        <div v-else>
          <h3 class="text-sm font-medium text-gray-900 mb-3">Create a new list:</h3>
        </div>

        <div class="space-y-3">
          <div>
            <label for="new-list-name" class="block text-sm font-medium text-gray-700 mb-1">
              List Name
            </label>
            <InputText
              id="new-list-name"
              v-model="newListName"
              placeholder="Enter a name for your list"
              class="w-full"
              :disabled="isCreating"
            />
          </div>
          
          <Button
            @click="createAndSaveToList"
            label="Create List & Save"
            icon="pi pi-plus"
            :loading="isCreating"
            :disabled="!newListName.trim()"
            class="w-full"
          />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end">
          <Button
            @click="showDialog = false"
            label="Close"
            text
          />
        </div>
      </template>
    </Dialog>

    <Toast />
  </div>
</template>

<script setup>
import { useToast } from 'primevue/usetoast'

const props = defineProps({
  reviewId: {
    type: String,
    required: true
  }
})

const client = useSupabaseClient()
const user = useSupabaseUser()
const toast = useToast()

// State
const showDialog = ref(false)
const userLists = ref([])
const newListName = ref('')
const isCreating = ref(false)
const savingListId = ref(null)
const isSaved = ref(false)

// Fetch user's lists
const fetchUserLists = async () => {
  if (!user.value) return
  
  try {
    const { data, error } = await client.rpc('get_user_saved_lists')
    
    if (error) throw error
    
    userLists.value = data || []
  } catch (error) {
    console.error('Error fetching user lists:', error)
  }
}

// Check if review is in a specific list
const isInList = (listId) => {
  const list = userLists.value.find(l => l.list_id === listId)
  return list?.items?.some(item => item.id === props.reviewId) || false
}

// Save to existing list
const saveToList = async (listId) => {
  if (!user.value) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Please log in to save reviews',
      life: 3000
    })
    return
  }

  savingListId.value = listId
  const isCurrentlyInList = isInList(listId)
  
  try {
    if (isCurrentlyInList) {
      // Remove from list
      const { error } = await client.rpc('remove_from_saved_list', {
        p_list_id: listId,
        p_review_id: props.reviewId
      })
      
      if (error) throw error
      
      toast.add({
        severity: 'success',
        summary: 'Removed',
        detail: 'Review removed from list',
        life: 3000
      })
    } else {
      // Add to list
      const { error } = await client.rpc('add_to_saved_list', {
        p_list_id: listId,
        p_review_id: props.reviewId
      })
      
      if (error) throw error
      
      toast.add({
        severity: 'success',
        summary: 'Saved',
        detail: 'Review added to list',
        life: 3000
      })
    }
    
    // Refresh lists
    await fetchUserLists()
    updateSavedStatus()
  } catch (error) {
    console.error('Error saving to list:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: isCurrentlyInList ? 'Failed to remove from list' : 'Failed to save to list',
      life: 3000
    })
  } finally {
    savingListId.value = null
  }
}

// Create new list and save
const createAndSaveToList = async () => {
  if (!user.value) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Please log in to create lists',
      life: 3000
    })
    return
  }

  if (!newListName.value.trim()) return
  
  isCreating.value = true
  try {
    // Create the list
    const { data: newListId, error: createError } = await client.rpc('create_saved_list', {
      list_name: newListName.value.trim()
    })
    
    if (createError) throw createError
    
    // Add the review to the new list
    const { error: addError } = await client.rpc('add_to_saved_list', {
      p_list_id: newListId,
      p_review_id: props.reviewId
    })
    
    if (addError) throw addError
    
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'List created and review saved',
      life: 3000
    })
    
    newListName.value = ''
    await fetchUserLists()
    updateSavedStatus()
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

// Update saved status
const updateSavedStatus = () => {
  isSaved.value = userLists.value.some(list => 
    list.items?.some(item => item.id === props.reviewId)
  )
}

// Watch for dialog open
watch(showDialog, (newValue) => {
  if (newValue && user.value) {
    fetchUserLists()
  }
})

// Watch for user changes
watch(user, (newUser) => {
  if (newUser) {
    fetchUserLists()
  } else {
    userLists.value = []
    isSaved.value = false
  }
})

// Initialize
onMounted(() => {
  if (user.value) {
    fetchUserLists()
  }
})
</script> 