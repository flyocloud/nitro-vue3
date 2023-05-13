import initFlyoApi from './helpers/api'
import Block from './components/Block.vue'
import Page from './components/Page.vue'

const FlyoVue = {
	install(Vue, options) {
		// Initialize the flyo api
		initFlyoApi(options)

	 	// Setup flyo components
		Vue.component(Block.name, Block)
		Vue.component(Page.name, Page)

		// Provide flyo object with global / persistent data
		Vue.provide('flyo', {
			liveEdit: options.liveEdit,
      		liveEditOrigin: options.liveEditOrigin
		})
	}
}

export default FlyoVue
export { FlyoVue, Block, Page }
export * from './composables/index'