import { inject } from 'vue'
import { storeToRefs } from 'pinia'

export const useFlyoConfig = () => {
	const { config } = inject('flyo')

  return {
		...storeToRefs(config),
		fetch: config.fetch
	}
}