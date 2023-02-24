<template>
  <div>
    <slot
      v-if="page"
      v-bind="page"
    >
      <FlyoBlock
        v-for="item in page.json"
        :key="item.uid"
        :item="item"
      />
    </slot>
  </div>
</template>

<script>
export default {
  name: 'FlyoPage',
  props: {
    page: {
      type: Object,
      default: false
    }
  },
}
</script>