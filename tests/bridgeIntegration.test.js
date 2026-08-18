// Integration guard: useFlyoLiveEdit.test.js mocks @flyo/nitro-js-bridge, so it cannot catch
// the case where highlightAndClick() returns the "open in editor" handler instead of a
// cleanup function. This suite runs against the real bridge outside the editor iframe.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

let mountedCb = null
let unmountedCb = null

vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual,
    inject: vi.fn(() => ({ liveEdit: true })),
    onMounted: vi.fn((cb) => { mountedCb = cb }),
    onUnmounted: vi.fn((cb) => { unmountedCb = cb })
  }
})

const { useFlyoLiveEdit } = await import('../src/composables/useFlyoLiveEdit.js')
const { isEmbedded } = await import('@flyo/nitro-js-bridge')

describe('bridge integration outside the editor', () => {
  beforeEach(() => {
    mountedCb = null
    unmountedCb = null
    document.body.innerHTML = ''
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('never posts a message when mounting, rewiring or unmounting', async () => {
    expect(isEmbedded()).toBe(false)

    const postMessage = vi.spyOn(window, 'postMessage')
    document.body.innerHTML = '<div data-flyo-uid="uid-1">A</div>'

    useFlyoLiveEdit()
    mountedCb()

    const el = document.createElement('div')
    el.setAttribute('data-flyo-uid', 'uid-2')
    document.body.appendChild(el)
    await new Promise((resolve) => setTimeout(resolve, 10))

    expect(() => unmountedCb()).not.toThrow()
    expect(postMessage).not.toHaveBeenCalled()

    postMessage.mockRestore()
  })
})
