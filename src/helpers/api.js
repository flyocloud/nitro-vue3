import { Configuration } from '@flyo/nitro-typescript'

let _configuration = null

const initFlyoApi = ({ apiToken, apiBasePath, defaultHeaders }) => {
  _configuration = new Configuration({
    apiKey: apiToken,
    ...(apiBasePath && { basePath: apiBasePath }),
    headers: defaultHeaders || {}
  })
}

export const getFlyoConfig = () => _configuration

export default initFlyoApi