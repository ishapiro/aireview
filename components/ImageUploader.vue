<template>
  <div class="image-uploader">
    <!-- Image Preview -->
    <div class="image-preview mb-4">
      <img
        v-if="modelValue"
        :src="modelValue"
        :alt="alt"
        class="max-w-full h-auto rounded-lg border"
        :class="previewClass"
      />
      <div
        v-else
        class="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center"
        :class="previewClass"
      >
        <div class="text-center text-gray-500">
          <i class="pi pi-image text-4xl mb-2"></i>
          <p class="text-sm">{{ placeholder || 'No image selected' }}</p>
        </div>
      </div>
    </div>

    <!-- Upload Button -->
    <div class="flex gap-2">
      <Button
        type="button"
        :label="uploadLabel || 'Upload Image'"
        :icon="uploadIcon || 'pi pi-upload'"
        @click="handleUpload"
        :loading="isUploading"
        :disabled="disabled"
        class="p-button-outlined"
      />
      
      <Button
        v-if="modelValue && allowRemove"
        type="button"
        label="Remove"
        icon="pi pi-trash"
        @click="handleRemove"
        :disabled="disabled"
        class="p-button-outlined p-button-danger"
      />
    </div>

    <!-- Help Text -->
    <small v-if="helpText" class="text-gray-500 mt-2 block">
      {{ helpText }}
    </small>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  folder: {
    type: String,
    default: 'uploads'
  },
  fileName: {
    type: String,
    default: null
  },
  maxSize: {
    type: Number,
    default: 5
  },
  userId: {
    type: String,
    default: null
  },
  showToast: {
    type: Boolean,
    default: true
  },
  uploadLabel: {
    type: String,
    default: 'Upload Image'
  },
  uploadIcon: {
    type: String,
    default: 'pi pi-upload'
  },
  placeholder: {
    type: String,
    default: 'No image selected'
  },
  helpText: {
    type: String,
    default: 'Upload an image (JPG, PNG, GIF up to 5MB)'
  },
  alt: {
    type: String,
    default: 'Uploaded image'
  },
  previewClass: {
    type: String,
    default: 'w-32 h-32'
  },
  allowRemove: {
    type: Boolean,
    default: true
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'upload-success', 'upload-error', 'remove'])

const { uploadImage } = useImageUpload()
const isUploading = ref(false)

const handleUpload = async () => {
  if (props.disabled) return
  
  isUploading.value = true
  try {
    const publicUrl = await uploadImage({
      folder: props.folder,
      fileName: props.fileName,
      maxSize: props.maxSize,
      userId: props.userId,
      showToast: props.showToast
    })
    
    if (publicUrl) {
      emit('update:modelValue', publicUrl)
      emit('upload-success', publicUrl)
    }
  } catch (error) {
    emit('upload-error', error)
  } finally {
    isUploading.value = false
  }
}

const handleRemove = () => {
  emit('update:modelValue', '')
  emit('remove')
}
</script> 