<template>
  <div>
    <slot v-if="page" v-bind="page">
      <FlyoBlock v-for="item in page.json" :key="item.uid" :item="item" />
    </slot>
  </div>
</template>

<script setup>
import { useFlyoLiveEdit } from '../composables/useFlyoLiveEdit'

useFlyoLiveEdit()

const props = defineProps({
  page: {
    type: [Object, Boolean],
    default: false
  }
})
</script>

<script>
export default {
  name: 'FlyoPage'
}
</script>