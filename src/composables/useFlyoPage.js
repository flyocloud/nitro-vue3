import { ref, unref } from 'vue'
import { PagesApi } from '@flyo/nitro-js'

export const useFlyoPage = (slug) => {
  const isLoading = ref(false)
  const response = ref(null)
  const error = ref(null)

  const fetch = async () => {
    try {
      error.value = null
      isLoading.value = true
      response.value = JSON.parse(JSON.stringify(await new PagesApi().page({ slug })))
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