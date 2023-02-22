import { ref } from 'vue'
import { flyoPagesApi } from '../helpers/api'
import { useFlyoContent } from './useFlyoContent'

/**
 * Resolves the page for a given route
 * @see https://stackoverflow.com/a/69208479/4611030
 * @see https://nuxt.com/docs/guide/directory-structure/composables
 * @see https://vuejs.org/guide/reusability/composables.html
 */
export const useFlyoPage = async(slug) => {
  const page = ref(null)
  const error = ref(null)

  try {
    page.value = await flyoPagesApi.page({slug: slug})
  } catch (error) {
    error.value = error
  }
  
  const { putContent, isEditable } = useFlyoContent(page.value.id)
  
  return {
    page: page,
    error: error,
    putContent,
    isEditable
  }
}