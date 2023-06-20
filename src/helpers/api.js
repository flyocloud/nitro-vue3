import { ApiClient } from '@flyo/nitro-js'

const initFlyoApi = ({ apiToken, apiBasePath, defaultHeaders }) => {
  const defaultClient = ApiClient.instance
  defaultClient.defaultHeaders = defaultHeaders || {}

	if (apiBasePath) {
		defaultClient.basePath = apiBasePath
	}

  const ApiToken = defaultClient.authentications["ApiToken"]
  ApiToken.apiKey = apiToken
}

export default initFlyoApi