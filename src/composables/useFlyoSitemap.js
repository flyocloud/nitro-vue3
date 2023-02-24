import { ref } from 'vue'
import { SitemapApi } from '@flyodev/nitrocms-js'

export const useFlyoSitemap = () => {
  const isLoading = ref(false)
  const response = ref(null)
  const error = ref(null)

  const fetch = async () => {
    try {
      error.value = null
      isLoading.value = true
      response.value = await new SitemapApi().sitemap()
    } catch (e) {
      isLoading.value = false
      sitemap.value = null
      error.value = e
    }
  }
  
  return {
    isLoading,
    response,
    error,
    fetch
  }
}