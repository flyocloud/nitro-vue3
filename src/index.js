import { createPinia } from 'pinia'
import initFlyoApi from './helpers/api'
import Block from './components/Block.vue'
import Page from './components/Page.vue'
import { useFlyoConfig } from './composables/useFlyoConfig'
import { useFlyoContent } from './composables/useFlyoContent'
import { useFlyoEntity } from './composables/useFlyoEntity'
import { useFlyoPage } from './composables/useFlyoPage'
import { useFlyoSitemap } from './composables/useFlyoSitemap'

const FlyoVue = {
	install(Vue, options) {
		// Initialize the flyo api
		initFlyoApi(options)

	 	// Setup flyo components
		Vue.component(Block.name, Block)
		Vue.component(Page.name, Page)

		// Setup pinia store
		const pinia = createPinia()
		Vue.use(pinia)

		// Provide flyo object with configs and all endpoints.
		// Make sure to pass pinia if the composable is a store.
		Vue.provide('flyo', {
			allowEdit: options.allowEdit,
			config: useFlyoConfig(pinia),
			content: useFlyoContent(),
			entity: useFlyoEntity(),
			page: useFlyoPage(),
			sitemap: useFlyoSitemap()
		})
	}
}

export default FlyoVue
export { FlyoVue, Block, Page }
export * from './composables/index'