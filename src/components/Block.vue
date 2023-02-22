<template>
  <component
    :is="item.component"
    :config="item.config"
    :content="item.content"
    :items="item.items"
    :slots="item.slots"
  />
</template>

<script>
export default {
  name: 'FlyoBlock',
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  }
}
</script>