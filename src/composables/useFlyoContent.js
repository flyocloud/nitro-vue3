import { inject } from 'vue'
import { ConfigApi, PagesApi } from '@flyodev/nitrocms-js'

export const useFlyoContent = (pageId, pageSlug) => {
  const { liveEdit } = inject('flyo')

  const isEditable = (authentication) => {
    if (authentication && liveEdit) {
      return true
    }

    return false
  }

  const putContent = async (blockUid, contentIdentifier, authentication, newValue) => {
    try {
      if (!pageId) {
        const page = await new PagesApi().page({ slug: pageSlug })
        pageId = page.id
      }

      const payload = {
        value: newValue,
        identifier: contentIdentifier,
        uid: blockUid,
        authentication
      }
      return await new ConfigApi().putContent(pageId, {content: payload})
    } catch (e) {
      throw e
    }
  }

  return {
    putContent,
    isEditable
  }
}