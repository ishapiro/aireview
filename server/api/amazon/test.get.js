export default defineEventHandler(async (event) => {
  return {
    message: 'Amazon API test endpoint working',
    timestamp: new Date().toISOString()
  }
}) 