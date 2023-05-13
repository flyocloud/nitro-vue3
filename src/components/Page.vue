<template>
  <div>
    <slot v-if="page" v-bind="page">
      <FlyoBlock v-for="item in page.json" :key="item.uid" :item="item" @click="() => openFlyoEdit(item)" />
    </slot>
  </div>
</template>

<script setup>
import { inject } from 'vue'

const props = defineProps({
  page: {
    type: [Object, Boolean],
    default: false
  }
})

const { liveEdit, liveEditOrigin } = inject('flyo')

const parentWindow = window => {
  const parentWindow = window.parent || window.opener
  if (window.self === parentWindow) {
    return false
  }

  return window.parent || window.opener;
}

const openFlyoEdit = (item) => {
  if (!liveEdit) {
    return
  }

  if (process.client && parentWindow(window)) {
    parentWindow(window).postMessage({
      action: 'openEdit',
      data: JSON.parse(JSON.stringify({
        page: props.page,
        item: item
      }))
    }, liveEditOrigin)
  }
}

if (process.client && parentWindow(window)) {
  window.addEventListener("message", (event) => {
    if (event.origin !== liveEditOrigin) {
      console.log(`Message from ${event.origin} blocked. Expected ${liveEditOrigin}.`)
      return
    }

    const message = event.data
    if (message.action === 'pageRefresh') {
      props.page = message.data
      /*
      const itemIndex = props.page.json.findIndex(item => item.uid === data.uid)
      props.page.json[itemIndex] = {
        ...props.page.json[itemIndex],
        ...data
      }
      */
    }
  })
}
</script>

<script>
export default {
  name: 'FlyoPage'
}
</script>