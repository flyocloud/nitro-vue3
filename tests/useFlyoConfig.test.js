import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@flyo/nitro-typescript', () => ({
  ConfigApi: vi.fn(),
  Configuration: vi.fn()
}))

vi.mock('../src/helpers/api.js', () => ({
  default: vi.fn(),
  getFlyoConfig: vi.fn().mockReturnValue({})
}))

const { ConfigApi } = await import('@flyo/nitro-typescript')
const { useFlyoConfig } = await import('../src/composables/useFlyoConfig.js')

describe('useFlyoConfig', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns isLoading, response, error refs and a fetch function', () => {
    const { isLoading, response, error, fetch } = useFlyoConfig()
    expect(typeof fetch).toBe('function')
    expect(isLoading).toBeDefined()
    expect(response).toBeDefined()
    expect(error).toBeDefined()
  })

  it('fetch resolves and sets the response', async () => {
    const mockData = { navigation: {}, slugs: ['home'] }
    ConfigApi.mockImplementation(() => ({
      config: vi.fn().mockResolvedValue(mockData)
    }))

    const { response, isLoading, fetch } = useFlyoConfig()
    await fetch()

    expect(response.value).toEqual(mockData)
    expect(isLoading.value).toBe(false)
  })

  it('fetch clears response and sets error on failure', async () => {
    ConfigApi.mockImplementation(() => ({
      config: vi.fn().mockRejectedValue({ status: 401, name: 'ResponseError' })
    }))

    const { response, error, isLoading, fetch } = useFlyoConfig()
    await fetch()

    expect(response.value).toBe(null)
    expect(error.value).toBeDefined()
    expect(isLoading.value).toBe(false)
  })
})
