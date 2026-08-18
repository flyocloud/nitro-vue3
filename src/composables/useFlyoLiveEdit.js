import { inject, onMounted, onUnmounted } from 'vue'
import { reload, scrollTo, highlightAndClick, isEmbedded } from '@flyo/nitro-js-bridge'

let observer = null
let mountedInstances = 0
let isInitialized = false
const cleanups = []

const cleanupBindings = () => {
  cleanups.forEach((fn) => fn())
  cleanups.length = 0
}

const wireAll = () => {
  cleanupBindings()

  // Outside the Flyo editor iframe highlightAndClick() has nothing to wire: it returns the
  // "open in editor" handler instead of a cleanup function. Calling that on the next rewire
  // or on unmount posts an openEdit message to our own window, which the browser rejects
  // because the target origin is the editor. Skip wiring when we are not embedded.
  if (!isEmbedded()) {
    return
  }

  document.querySelectorAll('[data-flyo-uid]').forEach((element) => {
    const uid = element.getAttribute('data-flyo-uid')
    if (uid && element instanceof HTMLElement) {
      const cleanup = highlightAndClick(uid, element)
      if (typeof cleanup === 'function') {
        cleanups.push(cleanup)
      }
    }
  })
}

const initializeLiveEdit = () => {
  if (isInitialized) {
    return
  }

  reload()
  scrollTo()
  wireAll()

  observer = new MutationObserver((mutations) => {
    const hasRelevantChanges = mutations.some((mutation) =>
      Array.from(mutation.addedNodes).some((node) => {
        if (node.nodeType !== Node.ELEMENT_NODE) {
          return false
        }

        const el = node
        return el.hasAttribute('data-flyo-uid') ||
          el.querySelector('[data-flyo-uid]')
      })
    )

    if (hasRelevantChanges) {
      wireAll()
    }
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  })

  isInitialized = true
}

const destroyLiveEdit = () => {
  if (!isInitialized) {
    return
  }

  if (observer) {
    observer.disconnect()
    observer = null
  }

  cleanupBindings()
  isInitialized = false
}

export const editable = (block) => {
  if (typeof block?.uid === 'string' && block.uid.trim() !== '') {
    return { 'data-flyo-uid': block.uid }
  }
  return {}
}

export const useFlyoLiveEdit = () => {
  const flyo = inject('flyo')
  const liveEdit = flyo?.liveEdit

  if (!liveEdit) {
    return
  }

  onMounted(() => {
    mountedInstances += 1
    initializeLiveEdit()
  })

  onUnmounted(() => {
    mountedInstances = Math.max(0, mountedInstances - 1)

    if (mountedInstances === 0) {
      destroyLiveEdit()
    }
  })
}
