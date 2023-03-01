import { ref, unref } from 'vue'
import { EntitiesApi } from '@flyodev/nitrocms-js'

export const useFlyoEntity = (uniqueid) => {
  const isLoading = ref(false)
  const response = ref(null)
  const error = ref(null)

  const fetch = async () => {
    try {
      error.value = null
      isLoading.value = true
      response.value = JSON.parse(JSON.stringify(await new EntitiesApi().entity(uniqueid)))
    } catch (e) {
      isLoading.value = false
      response.value = null
      error.value = e
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