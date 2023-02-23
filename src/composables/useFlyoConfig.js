import { ref } from 'vue'
import { defineStore } from 'pinia'
import { ConfigApi } from '@flyodev/nitrocms-js'

export const useFlyoConfig = defineStore('flyoConfig', () => {
	const isLoading = ref(null)
	const response = ref(null)
  const error = ref(null)

	const fetch = async () => {
		try {
      error.value = null
      isLoading.value = true
      response.value = await new ConfigApi().config()
      isLoading.value = false
    } catch (e) {
			isLoading.value = false
			response.value = null
      error.value = e
    }
	}

  return {
		response,
		isLoading,
    error,
		fetch
	}
})