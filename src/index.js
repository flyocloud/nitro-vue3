import initFlyoApi from './helpers/api'
import Block from './components/Block.vue'
import Page from './components/Page.vue'

const FlyoVue = {
	install(Vue, options) {
		Vue.provide('allowEdit', options.allowEdit)

		Vue.component(Block.name, Block)
		Vue.component(Page.name, Page)

		initFlyoApi(options)
	}
}

export default FlyoVue
export { FlyoVue, Block, Page }
export * from './composables/index'
export * from './helpers/api'