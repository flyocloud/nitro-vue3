import { ApiClient, ConfigApi, PagesApi, EntitiesApi, SitemapApi, ContentApi } from '@flyodev/nitrocms-js'

const initFlyoApi = ({ token, basePath, defaultHeaders }) => {
	const defaultClient = ApiClient.instance
  defaultClient.defaultHeaders = defaultHeaders || {}

  // for development purposes change the base path to the api. must end with `.../nitro`
	// 'http://flyoapi-web-api.dev.heartbeat.gmbh:7171/nitro'
	if (basePath) {
		defaultClient.basePath = basePath
	}

  const ApiKeyAuth = defaultClient.authentications["ApiKeyAuth"]
  ApiKeyAuth.apiKey = token
}

const flyoConfigApi = new ConfigApi()
const flyoPagesApi = new PagesApi()
const flyoEntitiesApi = new EntitiesApi()
const flyoSitemapApi = new SitemapApi()
const flyoContentApi = new ContentApi()

export default initFlyoApi
export {
	flyoConfigApi,
	flyoPagesApi,
	flyoEntitiesApi,
	flyoSitemapApi,
	flyoContentApi
}