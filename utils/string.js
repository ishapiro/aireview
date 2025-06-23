export function slugify(text) {
  if (!text || typeof text !== 'string') return ''
  
  let slug = text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/&/g, '-and-')      // Replace & with 'and'
    .replace(/[^\w\-]+/g, '')    // Remove all non-word characters
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '')          // Trim - from end of text
  
  // Limit to 25 characters
  if (slug.length > 25) {
    slug = slug.substring(0, 25)
    // Remove trailing hyphens after truncation
    slug = slug.replace(/-+$/, '')
  }
  
  return slug
}

export function generateUniqueSlug(baseSlug, existingSlugs = []) {
  let slug = baseSlug
  
  // If slug already exists, add a random 4-character suffix
  if (existingSlugs.includes(slug)) {
    const randomSuffix = Math.random().toString(36).substring(2, 6) // 4 random alphanumeric chars
    slug = `${slug}-${randomSuffix}`
    
    // If still too long after adding suffix, truncate the base part
    if (slug.length > 25) {
      const maxBaseLength = 21 // 25 - 4 (suffix length)
      slug = `${baseSlug.substring(0, maxBaseLength)}-${randomSuffix}`
      // Remove trailing hyphens after truncation
      slug = slug.replace(/-+$/, '')
    }
  }
  
  return slug
}

export function stripMarkdown(text) {
  if (!text) return ''
  
  return text
    .toString()
    // Remove headers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold/italic
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    // Remove links but keep text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove images
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove list markers
    .replace(/^[\s]*[-*+]\s+/gm, '')
    .replace(/^[\s]*\d+\.\s+/gm, '')
    // Remove blockquotes
    .replace(/^>\s+/gm, '')
    // Remove horizontal rules
    .replace(/^[\s]*[-*_]{3,}[\s]*$/gm, '')
    // Clean up extra whitespace
    .replace(/\n\s*\n/g, '\n')
    .replace(/\s+/g, ' ')
    .trim()
}

export function cleanTitle(text) {
  if (!text || typeof text !== 'string') return ''
  // Remove leading and trailing quotation marks
  return text.replace(/^["']|["']$/g, '')
} 