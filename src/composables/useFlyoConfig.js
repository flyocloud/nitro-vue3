import { inject } from 'vue'

export const useFlyoConfig = () => {
	const { config } = inject('flyo')

  return {
		...config,
		fetch: config.fetch
	}
}