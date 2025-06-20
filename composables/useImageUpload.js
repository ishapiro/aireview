import { useToast } from 'primevue/usetoast'

export const useImageUpload = () => {
  const client = useSupabaseClient()
  const toast = useToast()

  /**
   * Upload an image to Supabase storage
   * @param {Object} options - Upload options
   * @param {string} options.folder - Storage folder (e.g., 'avatars', 'categories', 'thumbnails')
   * @param {string} options.fileName - Custom file name (optional, will generate if not provided)
   * @param {number} options.maxSize - Maximum file size in MB (default: 5)
   * @param {string} options.userId - User ID for file naming (optional)
   * @param {boolean} options.showToast - Whether to show toast notifications (default: true)
   * @returns {Promise<string>} Public URL of uploaded image
   */
  const uploadImage = async ({
    folder = 'uploads',
    fileName = null,
    maxSize = 5,
    userId = null,
    showToast = true
  } = {}) => {
    try {
      // Create file input and get file
      const file = await new Promise((resolve) => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'
        input.onchange = (e) => resolve(e.target.files[0])
        input.click()
      })

      if (!file) {
        return null
      }

      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        const error = `File size must be less than ${maxSize}MB`
        if (showToast) {
          toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error,
            life: 3000
          })
        }
        throw new Error(error)
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        const error = 'Please select a valid image file'
        if (showToast) {
          toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error,
            life: 3000
          })
        }
        throw new Error(error)
      }

      // Generate file name
      const fileExt = file.name.split('.').pop()
      const finalFileName = fileName || `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `${folder}/${finalFileName}`

      // Upload to Supabase storage
      const { error: uploadError } = await client.storage
        .from('reviews')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = client.storage
        .from('reviews')
        .getPublicUrl(filePath)

      if (showToast) {
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Image uploaded successfully!',
          life: 3000
        })
      }

      return publicUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      const errorMessage = error.message || 'Error uploading image. Please try again.'
      
      if (showToast) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage,
          life: 3000
        })
      }
      
      throw error
    }
  }

  /**
   * Upload avatar image with user-specific naming
   * @param {string} userId - User ID for file naming
   * @returns {Promise<string>} Public URL of uploaded avatar
   */
  const uploadAvatar = async (userId) => {
    return uploadImage({
      folder: 'avatars',
      fileName: `${userId}-${Date.now()}`,
      maxSize: 5,
      userId,
      showToast: true
    })
  }

  /**
   * Upload category image
   * @returns {Promise<string>} Public URL of uploaded category image
   */
  const uploadCategoryImage = async () => {
    return uploadImage({
      folder: 'categories',
      maxSize: 5,
      showToast: true
    })
  }

  /**
   * Upload review thumbnail
   * @returns {Promise<string>} Public URL of uploaded thumbnail
   */
  const uploadThumbnail = async () => {
    return uploadImage({
      folder: 'thumbnails',
      maxSize: 5,
      showToast: true
    })
  }

  /**
   * Delete an image from storage
   * @param {string} filePath - Path to the file in storage
   * @param {boolean} showToast - Whether to show toast notifications
   * @returns {Promise<void>}
   */
  const deleteImage = async (filePath, showToast = true) => {
    try {
      const { error } = await client.storage
        .from('reviews')
        .remove([filePath])

      if (error) throw error

      if (showToast) {
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Image deleted successfully!',
          life: 3000
        })
      }
    } catch (error) {
      console.error('Error deleting image:', error)
      const errorMessage = error.message || 'Error deleting image. Please try again.'
      
      if (showToast) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage,
          life: 3000
        })
      }
      
      throw error
    }
  }

  return {
    uploadImage,
    uploadAvatar,
    uploadCategoryImage,
    uploadThumbnail,
    deleteImage
  }
} 