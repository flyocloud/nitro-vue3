import { ref, unref } from 'vue'
import { PagesApi } from '@flyodev/nitrocms-js'
import { useFlyoContent } from './useFlyoContent'

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
      error.value = e
    }

		return {
			response: unref(response),
			error: unref(error)
		}
  }

	const { putContent, isEditable } = useFlyoContent(null, slug)

  return {
    isLoading,
    response,
    error,
    fetch,
    putContent,
    isEditable
  }
}