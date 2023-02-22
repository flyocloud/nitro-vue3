import { ref } from 'vue'
import { flyoEntitiesApi } from '../helpers/api'

export const useFlyoEntity = async (uniqueid) => {
  const response = ref(null)

  try {
    response.value = await flyoEntitiesApi.entity(uniqueid)
  } catch (e) {
    response.value = false
  }
  
  return {
    response: response
  }
}