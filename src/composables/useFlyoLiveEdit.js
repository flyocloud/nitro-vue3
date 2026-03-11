import { inject, onMounted, onUnmounted } from 'vue'
import { reload, scrollTo, highlightAndClick } from '@flyo/nitro-js-bridge'

export const editable = (block) => {
  if (typeof block?.uid === 'string' && block.uid.trim() !== '') {
    return { 'data-flyo-uid': block.uid }
  }
  return {}
}

export const useFlyoLiveEdit = () => {
  const { liveEdit } = inject('flyo')

  if (!liveEdit) {
    return
  }

  let observer = null
  const cleanups = []

  const wireAll = () => {
    // Clean up previous highlight bindings
    cleanups.forEach(fn => fn())
    cleanups.length = 0

    document.querySelectorAll('[data-flyo-uid]').forEach(element => {
      const uid = element.getAttribute('data-flyo-uid')
      if (uid && element instanceof HTMLElement) {
        const cleanup = highlightAndClick(uid, element)
        if (typeof cleanup === 'function') {
          cleanups.push(cleanup)
        }
      }
    })
  }

  onMounted(() => {
    reload()
    scrollTo()
    wireAll()

    observer = new MutationObserver((mutations) => {
      const hasRelevantChanges = mutations.some(mutation =>
        Array.from(mutation.addedNodes).some(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node
            return el.hasAttribute('data-flyo-uid') ||
              el.querySelector('[data-flyo-uid]')
          }
          return false
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
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
    cleanups.forEach(fn => fn())
    cleanups.length = 0
  })
}
