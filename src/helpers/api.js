import { ApiClient } from '@flyodev/nitrocms-js'

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

export default initFlyoApi