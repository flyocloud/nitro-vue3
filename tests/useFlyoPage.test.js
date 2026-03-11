import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@flyo/nitro-typescript', () => ({
  PagesApi: vi.fn(),
  Configuration: vi.fn()
}))

vi.mock('../src/helpers/api.js', () => ({
  default: vi.fn(),
  getFlyoConfig: vi.fn().mockReturnValue({})
}))

const { PagesApi } = await import('@flyo/nitro-typescript')
const { useFlyoPage } = await import('../src/composables/useFlyoPage.js')

describe('useFlyoPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns isLoading, response, error refs and a fetch function', () => {
    const { isLoading, response, error, fetch } = useFlyoPage('home')
    expect(typeof fetch).toBe('function')
    expect(isLoading.value).toBe(false)
    expect(response.value).toBe(null)
    expect(error.value).toBe(null)
  })

  it('fetch calls page() with the correct slug', async () => {
    const mockPageFn = vi.fn().mockResolvedValue({ slug: 'about', json: [] })
    PagesApi.mockImplementation(() => ({ page: mockPageFn }))

    const { fetch } = useFlyoPage('about')
    await fetch()

    expect(mockPageFn).toHaveBeenCalledWith({ slug: 'about' })
  })

  it('fetch resolves and sets response', async () => {
    const mockData = { slug: 'contact', json: [{ uid: '1' }] }
    PagesApi.mockImplementation(() => ({
      page: vi.fn().mockResolvedValue(mockData)
    }))

    const { response, isLoading, fetch } = useFlyoPage('contact')
    await fetch()

    expect(response.value).toEqual(mockData)
    expect(isLoading.value).toBe(false)
  })

  it('fetch sets error on failure', async () => {
    PagesApi.mockImplementation(() => ({
      page: vi.fn().mockRejectedValue({ status: 404, name: 'ResponseError' })
    }))

    const { response, error, fetch } = useFlyoPage('nonexistent')
    await fetch()

    expect(response.value).toBe(null)
    expect(error.value).toBeDefined()
  })

  it('each call to useFlyoPage gets its own isolated state', () => {
    const a = useFlyoPage('page-a')
    const b = useFlyoPage('page-b')
    expect(a.response).not.toBe(b.response)
  })
})
