import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@flyo/nitro-typescript', () => ({
  SitemapApi: vi.fn(),
  Configuration: vi.fn()
}))

vi.mock('../src/helpers/api.js', () => ({
  default: vi.fn(),
  getFlyoConfig: vi.fn().mockReturnValue({})
}))

const { SitemapApi } = await import('@flyo/nitro-typescript')
const { useFlyoSitemap } = await import('../src/composables/useFlyoSitemap.js')

describe('useFlyoSitemap', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns isLoading, response, error refs and a fetch function', () => {
    const { isLoading, response, error, fetch } = useFlyoSitemap()
    expect(typeof fetch).toBe('function')
    expect(isLoading.value).toBe(false)
    expect(response.value).toBe(null)
    expect(error.value).toBe(null)
  })

  it('fetch resolves and sets response', async () => {
    const mockData = [{ href: '/home' }, { href: '/about' }]
    SitemapApi.mockImplementation(() => ({
      sitemap: vi.fn().mockResolvedValue(mockData)
    }))

    const { response, isLoading, fetch } = useFlyoSitemap()
    await fetch()

    expect(response.value).toEqual(mockData)
    expect(isLoading.value).toBe(false)
  })

  it('fetch sets error on failure', async () => {
    SitemapApi.mockImplementation(() => ({
      sitemap: vi.fn().mockRejectedValue({ status: 500, name: 'ResponseError' })
    }))

    const { response, error, fetch } = useFlyoSitemap()
    await fetch()

    expect(response.value).toBe(null)
    expect(error.value).toBeDefined()
  })

  it('each call to useFlyoSitemap gets its own isolated state', () => {
    const a = useFlyoSitemap()
    const b = useFlyoSitemap()
    expect(a.response).not.toBe(b.response)
  })
})
