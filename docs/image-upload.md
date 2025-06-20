# Image Upload System

This document describes the centralized image upload system used throughout the Cogitations Reviews application.

## Overview

The image upload functionality has been centralized into a reusable composable (`useImageUpload`) and component (`ImageUploader`) to ensure consistency, reduce code duplication, and make maintenance easier.

## Important Notes

### Registration Flow
Due to Row Level Security (RLS) policies in Supabase storage, avatar uploads are not available during the registration process. Users can add their profile picture after creating their account in the profile settings page. This ensures security while maintaining a smooth user experience.

## Composable: `useImageUpload`

The `useImageUpload` composable provides the core image upload functionality.

### Basic Usage

```javascript
import { useImageUpload } from '@/composables/useImageUpload'

const { uploadImage, uploadAvatar, uploadCategoryImage, uploadThumbnail, deleteImage } = useImageUpload()
```

### Available Functions

#### `uploadImage(options)`
Generic image upload function with configurable options.

**Parameters:**
- `folder` (string): Storage folder (e.g., 'avatars', 'categories', 'thumbnails')
- `fileName` (string, optional): Custom file name
- `maxSize` (number): Maximum file size in MB (default: 5)
- `userId` (string, optional): User ID for file naming
- `showToast` (boolean): Whether to show toast notifications (default: true)

**Returns:** Promise<string> - Public URL of uploaded image

**Example:**
```javascript
const publicUrl = await uploadImage({
  folder: 'custom',
  fileName: 'my-image',
  maxSize: 10,
  showToast: false
})
```

#### `uploadAvatar(userId)`
Upload avatar image with user-specific naming.

**Parameters:**
- `userId` (string): User ID for file naming

**Returns:** Promise<string> - Public URL of uploaded avatar

**Example:**
```javascript
const avatarUrl = await uploadAvatar(user.value.id)
```

#### `uploadCategoryImage()`
Upload category image with predefined settings.

**Returns:** Promise<string> - Public URL of uploaded category image

**Example:**
```javascript
const categoryImageUrl = await uploadCategoryImage()
```

#### `uploadThumbnail()`
Upload review thumbnail with predefined settings.

**Returns:** Promise<string> - Public URL of uploaded thumbnail

**Example:**
```javascript
const thumbnailUrl = await uploadThumbnail()
```

#### `deleteImage(filePath, showToast)`
Delete an image from storage.

**Parameters:**
- `filePath` (string): Path to the file in storage
- `showToast` (boolean): Whether to show toast notifications (default: true)

**Returns:** Promise<void>

**Example:**
```javascript
await deleteImage('avatars/user-123.jpg')
```

## Component: `ImageUploader`

The `ImageUploader` component provides a complete UI for image uploads with preview and remove functionality.

### Basic Usage

```vue
<template>
  <ImageUploader
    v-model="imageUrl"
    folder="avatars"
    :userId="user.id"
    upload-label="Upload Avatar"
    help-text="Upload your profile picture"
  />
</template>

<script setup>
const imageUrl = ref('')
const user = useSupabaseUser()
</script>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | String | `''` | The image URL (v-model) |
| `folder` | String | `'uploads'` | Storage folder |
| `fileName` | String | `null` | Custom file name |
| `maxSize` | Number | `5` | Maximum file size in MB |
| `userId` | String | `null` | User ID for file naming |
| `showToast` | Boolean | `true` | Show toast notifications |
| `uploadLabel` | String | `'Upload Image'` | Upload button label |
| `uploadIcon` | String | `'pi pi-upload'` | Upload button icon |
| `placeholder` | String | `'No image selected'` | Placeholder text |
| `helpText` | String | `'Upload an image (JPG, PNG, GIF up to 5MB)'` | Help text |
| `alt` | String | `'Uploaded image'` | Image alt text |
| `previewClass` | String | `'w-32 h-32'` | Preview container CSS classes |
| `allowRemove` | Boolean | `true` | Show remove button |
| `disabled` | Boolean | `false` | Disable upload functionality |

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | String | Emitted when image URL changes |
| `upload-success` | String | Emitted when upload succeeds |
| `upload-error` | Error | Emitted when upload fails |
| `remove` | - | Emitted when image is removed |

### Examples

#### Avatar Upload
```vue
<ImageUploader
  v-model="form.avatar_url"
  folder="avatars"
  :userId="user.id"
  upload-label="Upload Avatar"
  preview-class="w-24 h-24"
  help-text="Upload your profile picture (JPG, PNG, GIF up to 5MB)"
/>
```

#### Category Image Upload
```vue
<ImageUploader
  v-model="form.image_url"
  folder="categories"
  upload-label="Upload Category Image"
  preview-class="w-48 h-32"
  help-text="Upload a category banner image"
/>
```

#### Review Thumbnail Upload
```vue
<ImageUploader
  v-model="form.thumbnail_url"
  folder="thumbnails"
  upload-label="Upload Thumbnail"
  preview-class="w-32 h-32"
  help-text="Upload a thumbnail for your review"
/>
```

## Migration Guide

### Before (Inline Implementation)
```javascript
const handleImageUpload = async () => {
  try {
    const file = await new Promise((resolve) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.onchange = (e) => resolve(e.target.files[0])
      input.click()
    })

    if (!file) return

    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `categories/${fileName}`

    const { error: uploadError } = await client.storage
      .from('reviews')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = client.storage
      .from('reviews')
      .getPublicUrl(filePath)

    form.value.image_url = publicUrl
  } catch (error) {
    console.error('Error uploading image:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Error uploading image. Please try again.',
      life: 3000
    })
  }
}
```

### After (Using Composable)
```javascript
const { uploadCategoryImage } = useImageUpload()

const handleImageUpload = async () => {
  try {
    const publicUrl = await uploadCategoryImage()
    if (publicUrl) {
      form.value.image_url = publicUrl
    }
  } catch (error) {
    console.error('Error in handleImageUpload:', error)
  }
}
```

### After (Using Component)
```vue
<ImageUploader
  v-model="form.image_url"
  folder="categories"
  upload-label="Upload Category Image"
/>
```

## Benefits

1. **Consistency**: All image uploads use the same validation, error handling, and file naming
2. **Maintainability**: Single place to update upload logic
3. **Reusability**: No code duplication across components
4. **Type Safety**: Better TypeScript support with proper typing
5. **Flexibility**: Configurable for different use cases
6. **User Experience**: Consistent UI and feedback across the application

## Storage Structure

Images are stored in the Supabase `reviews` bucket with the following folder structure:

```
reviews/
├── avatars/          # User profile pictures
├── categories/       # Category banner images
├── thumbnails/       # Review thumbnails
└── uploads/          # General uploads
```

## File Naming Convention

- **Avatars**: `{userId}-{timestamp}.{ext}`
- **Categories**: `{timestamp}-{random}.{ext}`
- **Thumbnails**: `{timestamp}-{random}.{ext}`
- **General**: `{timestamp}-{random}.{ext}`

## Validation

The system validates:
- File type (must be image/*)
- File size (configurable, default 5MB)
- File existence before upload

## Error Handling

All upload functions include comprehensive error handling with:
- User-friendly error messages
- Toast notifications (configurable)
- Console logging for debugging
- Graceful fallbacks 