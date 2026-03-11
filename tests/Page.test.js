import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { mount } from '@vue/test-utils'

vi.mock('@flyo/nitro-js-bridge', () => ({
  reload: vi.fn(),
  scrollTo: vi.fn(),
  highlightAndClick: vi.fn(() => vi.fn()),
}))

const { reload, scrollTo, highlightAndClick } = await import('@flyo/nitro-js-bridge')
const { default: FlyoPage } = await import('../src/components/Page.vue')

const globalConfig = {
  provide: {
    flyo: {
      liveEdit: true,
      liveEditOrigin: 'https://flyo.cloud',
    },
  },
  stubs: {
    FlyoBlock: true,
  },
}

const createMountOptions = () => ({
  attachTo: document.body,
  global: globalConfig,
})

const flushDom = async () => {
  await nextTick()
  await Promise.resolve()
  await new Promise((resolve) => setTimeout(resolve, 0))
}

describe('FlyoPage live-edit setup', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    document.body.innerHTML = ''
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('initializes live edit only once with multiple FlyoPage instances', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const Host = defineComponent({
      components: { FlyoPage },
      template: `
        <div>
          <FlyoPage :page="{ json: [] }">
            <template #default><div data-flyo-uid="first"></div></template>
          </FlyoPage>
          <FlyoPage :page="{ json: [] }">
            <template #default><div data-flyo-uid="second"></div></template>
          </FlyoPage>
        </div>
      `,
    })

    const wrapper = mount(Host, createMountOptions())
    await flushDom()

    expect(reload).toHaveBeenCalledTimes(1)
    expect(scrollTo).toHaveBeenCalledTimes(1)

    const warningMessages = warnSpy.mock.calls.map((args) => String(args[0]))
    expect(
      warningMessages.some((message) => message.includes('onMounted') && message.includes('no active component instance'))
    ).toBe(false)
    expect(
      warningMessages.some((message) => message.includes('onUnmounted') && message.includes('no active component instance'))
    ).toBe(false)

    warnSpy.mockRestore()
    wrapper.unmount()
  })

  it('wires initial uid elements and reinitializes after route-like remount', async () => {
    const firstWrapper = mount(FlyoPage, {
      props: {
        page: { json: [] },
      },
      slots: {
        default: '<div data-flyo-uid="initial"></div>',
      },
      ...createMountOptions(),
    })

    await flushDom()

    expect(reload).toHaveBeenCalledTimes(1)
    expect(scrollTo).toHaveBeenCalledTimes(1)
    expect(highlightAndClick).toHaveBeenCalledWith('initial', expect.any(HTMLElement))

    firstWrapper.unmount()
    await flushDom()

    const secondWrapper = mount(FlyoPage, {
      props: {
        page: { json: [] },
      },
      slots: {
        default: '<div data-flyo-uid="next"></div>',
      },
      ...createMountOptions(),
    })

    await flushDom()

    expect(reload).toHaveBeenCalledTimes(2)
    expect(scrollTo).toHaveBeenCalledTimes(2)
    expect(highlightAndClick).toHaveBeenCalledWith('next', expect.any(HTMLElement))

    secondWrapper.unmount()
  })

  it('observes uid elements added after the initial render', async () => {
    const Host = defineComponent({
      components: { FlyoPage },
      data: () => ({ uid: 'initial' }),
      template: `
        <FlyoPage :page="{ json: [] }">
          <template #default>
            <div :key="uid" :data-flyo-uid="uid"></div>
          </template>
        </FlyoPage>
      `,
    })

    const wrapper = mount(Host, createMountOptions())
    await flushDom()

    const initialCallCount = highlightAndClick.mock.calls.length

    wrapper.vm.uid = 'dynamic-next'
    await flushDom()
    await flushDom()

    expect(highlightAndClick).toHaveBeenCalledWith('dynamic-next', expect.any(HTMLElement))
    expect(highlightAndClick.mock.calls.length).toBeGreaterThan(initialCallCount)

    wrapper.unmount()
  })
})
