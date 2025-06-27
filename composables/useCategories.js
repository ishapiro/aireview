export const useCategories = () => {
  const client = useSupabaseClient()
  return useAsyncData('categories', async () => {
    const { data } = await client
      .from('categories_with_review_count')
      .select('*')
      .order('review_count', { ascending: false })
    return data
  })
} 