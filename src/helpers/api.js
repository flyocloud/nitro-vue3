import { ApiClient } from '@flyodev/nitrocms-js'

const initFlyoApi = ({ apiToken, apiBasePath, defaultHeaders }) => {
  const defaultClient = ApiClient.instance
  defaultClient.defaultHeaders = defaultHeaders || {}

	if (apiBasePath) {
		defaultClient.basePath = apiBasePath
	}

  const ApiKeyAuth = defaultClient.authentications["ApiKeyAuth"]
  ApiKeyAuth.apiKey = apiToken
}

export default initFlyoApi