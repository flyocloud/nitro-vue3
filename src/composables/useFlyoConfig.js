import { ConfigApi } from '@flyodev/nitrocms-js'
import { reactive, toRefs } from 'vue'

const flyoConfigState = reactive({
	isLoading: null,
	response: null,
	error: null
})

export const useFlyoConfig = () => {
	const fetch = async () => {
		try {
      flyoConfigState.error = null
      flyoConfigState.isLoading = true
      flyoConfigState.response = JSON.parse(JSON.stringify(await new ConfigApi().config()))
      flyoConfigState.isLoading = false
    } catch (e) {
			flyoConfigState.isLoading = false
			flyoConfigState.response = null
      flyoConfigState.error = JSON.parse(JSON.stringify(e))
    }

		return {
			response: flyoConfigState.response,
			error: flyoConfigState.error
		}
	}

  return {
		...toRefs(flyoConfigState),
		fetch
	}
}