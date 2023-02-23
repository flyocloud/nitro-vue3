import { inject } from 'vue'
import { ConfigApi } from '@flyodev/nitrocms-js'

export const useFlyoContent = (pageId) => {
  const isEditable = (authentication) => {
    const allowEdit = inject('allowEdit')

    if (authentication && allowEdit) {
      return true
    }

    return false
  }

  const putContent = async (blockUid, contentIdentifier, authentication, newValue) => {
    try {
      const payload = {
        value: newValue,
        identifier: contentIdentifier,
        uid: blockUid,
        authentication
      }
      await new ConfigApi().putContent(pageId, {content: payload})
    } catch (e) {
      console.error(e)
    }
  }

  return {
    putContent,
    isEditable
  }
}