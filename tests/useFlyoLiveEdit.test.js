import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

let mountedCb = null
let unmountedCb = null

vi.mock('@flyo/nitro-js-bridge', () => ({
  reload: vi.fn(),
  scrollTo: vi.fn(),
  highlightAndClick: vi.fn(() => vi.fn()),
}))

vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual,
    inject: vi.fn(),
    onMounted: vi.fn((cb) => { mountedCb = cb }),
    onUnmounted: vi.fn((cb) => { unmountedCb = cb }),
  }
})

const { reload, scrollTo, highlightAndClick } = await import('@flyo/nitro-js-bridge')
const { inject } = await import('vue')
const { editable, useFlyoLiveEdit } = await import('../src/composables/useFlyoLiveEdit.js')

describe('editable', () => {
  it('returns data-flyo-uid when block has a uid', () => {
    expect(editable({ uid: 'abc-123' })).toEqual({ 'data-flyo-uid': 'abc-123' })
  })

  it('returns empty object when block has no uid', () => {
    expect(editable({})).toEqual({})
  })

  it('returns empty object when uid is empty string', () => {
    expect(editable({ uid: '' })).toEqual({})
  })

  it('returns empty object when uid is whitespace only', () => {
    expect(editable({ uid: '   ' })).toEqual({})
  })

  it('returns empty object when block is null', () => {
    expect(editable(null)).toEqual({})
  })

  it('returns empty object when block is undefined', () => {
    expect(editable(undefined)).toEqual({})
  })
})

describe('useFlyoLiveEdit', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mountedCb = null
    unmountedCb = null
  })

  it('does nothing when liveEdit is false', () => {
    inject.mockReturnValue({ liveEdit: false })
    useFlyoLiveEdit()

    expect(reload).not.toHaveBeenCalled()
    expect(scrollTo).not.toHaveBeenCalled()
  })

  it('registers reload, scrollTo, and highlightAndClick on mount', () => {
    inject.mockReturnValue({ liveEdit: true })
    useFlyoLiveEdit()

    // Create a test element with data-flyo-uid
    const el = document.createElement('div')
    el.setAttribute('data-flyo-uid', 'block-1')
    document.body.appendChild(el)

    mountedCb()

    expect(reload).toHaveBeenCalledOnce()
    expect(scrollTo).toHaveBeenCalledOnce()
    expect(highlightAndClick).toHaveBeenCalledWith('block-1', el)

    document.body.removeChild(el)
  })

  it('cleans up observer and highlight callbacks on unmount', () => {
    inject.mockReturnValue({ liveEdit: true })
    const cleanupFn = vi.fn()
    highlightAndClick.mockReturnValue(cleanupFn)

    useFlyoLiveEdit()

    const el = document.createElement('div')
    el.setAttribute('data-flyo-uid', 'block-2')
    document.body.appendChild(el)

    mountedCb()
    unmountedCb()

    expect(cleanupFn).toHaveBeenCalled()

    document.body.removeChild(el)
  })

  it('wires multiple elements with data-flyo-uid', () => {
    inject.mockReturnValue({ liveEdit: true })
    useFlyoLiveEdit()

    const el1 = document.createElement('div')
    el1.setAttribute('data-flyo-uid', 'a')
    const el2 = document.createElement('div')
    el2.setAttribute('data-flyo-uid', 'b')
    document.body.appendChild(el1)
    document.body.appendChild(el2)

    mountedCb()

    expect(highlightAndClick).toHaveBeenCalledTimes(2)
    expect(highlightAndClick).toHaveBeenCalledWith('a', el1)
    expect(highlightAndClick).toHaveBeenCalledWith('b', el2)

    document.body.removeChild(el1)
    document.body.removeChild(el2)
  })
})
