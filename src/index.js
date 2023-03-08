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

		/* WIP
		// Setup edit directive
		Vue.directive('edit', {
			beforeMount(el) {
				el.setAttribute("contenteditable", true
				el.addEventListener('onChange', () => {
					console.log(el.originalValue)
				})
			},
			mounted(el) {
				el.originalValue = el.innerHtml
			}
		})*/

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