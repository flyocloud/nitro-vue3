import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Configuration } from '@flyo/nitro-typescript'

vi.mock('@flyo/nitro-typescript', () => ({
  Configuration: vi.fn().mockImplementation((params) => ({ ...params }))
}))

// Import after mock registration
const { default: initFlyoApi, getFlyoConfig } = await import('../src/helpers/api.js')

describe('initFlyoApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates a Configuration instance with the provided apiKey', () => {
    initFlyoApi({ apiToken: 'test-token-123' })
    expect(Configuration).toHaveBeenCalledWith(
      expect.objectContaining({ apiKey: 'test-token-123' })
    )
  })

  it('passes custom basePath when provided', () => {
    initFlyoApi({ apiToken: 'tok', apiBasePath: 'https://custom.api.example' })
    expect(Configuration).toHaveBeenCalledWith(
      expect.objectContaining({ basePath: 'https://custom.api.example' })
    )
  })

  it('does not set basePath when not provided', () => {
    initFlyoApi({ apiToken: 'tok' })
    const call = Configuration.mock.calls[0][0]
    expect(call).not.toHaveProperty('basePath')
  })

  it('defaults to empty headers when defaultHeaders is not provided', () => {
    initFlyoApi({ apiToken: 'tok' })
    expect(Configuration).toHaveBeenCalledWith(
      expect.objectContaining({ headers: {} })
    )
  })

  it('passes custom defaultHeaders when provided', () => {
    initFlyoApi({ apiToken: 'tok', defaultHeaders: { 'X-Custom': 'value' } })
    expect(Configuration).toHaveBeenCalledWith(
      expect.objectContaining({ headers: { 'X-Custom': 'value' } })
    )
  })

  it('getFlyoConfig returns the initialized configuration', () => {
    initFlyoApi({ apiToken: 'abc' })
    const config = getFlyoConfig()
    expect(config).toBeTruthy()
  })
})
