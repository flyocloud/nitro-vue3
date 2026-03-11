import { ref, unref } from 'vue'
import { PagesApi } from '@flyo/nitro-typescript'
import { getFlyoConfig } from '../helpers/api'

export const useFlyoPage = (slug) => {
  const isLoading = ref(false)
  const response = ref(null)
  const error = ref(null)

  const fetch = async () => {
    try {
      error.value = null
      isLoading.value = true
      response.value = JSON.parse(JSON.stringify(await new PagesApi(getFlyoConfig()).page({ slug })))
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