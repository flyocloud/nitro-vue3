import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@flyo/nitro-typescript', () => ({
  EntitiesApi: vi.fn(),
  Configuration: vi.fn()
}))

vi.mock('../src/helpers/api.js', () => ({
  default: vi.fn(),
  getFlyoConfig: vi.fn().mockReturnValue({})
}))

const { EntitiesApi } = await import('@flyo/nitro-typescript')
const { useFlyoEntity } = await import('../src/composables/useFlyoEntity.js')

describe('useFlyoEntity', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns isLoading, response, error refs and a fetch function', () => {
    const { isLoading, response, error, fetch } = useFlyoEntity('my-entity-uid')
    expect(typeof fetch).toBe('function')
    expect(isLoading.value).toBe(false)
    expect(response.value).toBe(null)
    expect(error.value).toBe(null)
  })

  it('fetch calls entityByUniqueid() with the correct uniqueid', async () => {
    const mockFn = vi.fn().mockResolvedValue({ uniqueid: 'blog-entry-1', fields: {} })
    EntitiesApi.mockImplementation(() => ({ entityByUniqueid: mockFn }))

    const { fetch } = useFlyoEntity('blog-entry-1')
    await fetch()

    expect(mockFn).toHaveBeenCalledWith({ uniqueid: 'blog-entry-1' })
  })

  it('fetch resolves and sets response', async () => {
    const mockData = { uniqueid: 'entity-42', fields: { title: 'Hello' } }
    EntitiesApi.mockImplementation(() => ({
      entityByUniqueid: vi.fn().mockResolvedValue(mockData)
    }))

    const { response, isLoading, fetch } = useFlyoEntity('entity-42')
    await fetch()

    expect(response.value).toEqual(mockData)
    expect(isLoading.value).toBe(false)
  })

  it('fetch sets error on failure', async () => {
    EntitiesApi.mockImplementation(() => ({
      entityByUniqueid: vi.fn().mockRejectedValue({ status: 404, name: 'ResponseError' })
    }))

    const { response, error, fetch } = useFlyoEntity('missing-entity')
    await fetch()

    expect(response.value).toBe(null)
    expect(error.value).toBeDefined()
  })

  it('each call to useFlyoEntity gets its own isolated state', () => {
    const a = useFlyoEntity('uid-a')
    const b = useFlyoEntity('uid-b')
    expect(a.response).not.toBe(b.response)
  })
})
