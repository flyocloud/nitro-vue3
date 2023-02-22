import { ref } from 'vue'
import { flyoSitemapApi } from '../helpers/api'

export const useFlyoSitemap = async () => {

  const sitemap = ref(false)

  try {
    sitemap.value = await flyoSitemapApi.sitemap()
  } catch (e) {
    sitemap.value = false
  }
  
  return {
    sitemap: sitemap
  }
}