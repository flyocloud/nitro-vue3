import { ref, unref } from 'vue'
import { SitemapApi } from '@flyo/nitro-typescript'
import { getFlyoConfig } from '../helpers/api'

export const useFlyoSitemap = () => {
  const isLoading = ref(false)
  const response = ref(null)
  const error = ref(null)

  const fetch = async () => {
    try {
      error.value = null
      isLoading.value = true
      response.value = JSON.parse(JSON.stringify(await new SitemapApi(getFlyoConfig()).sitemap()))
      isLoading.value = false
    } catch (e) {
      isLoading.value = false
      response.value = null
      error.value = JSON.parse(JSON.stringify(e))
    }

    return {
      response: unref(response),
      error: unref(error)
    }
  }

  return {
    isLoading,
    response,
    error,
    fetch
  }
}