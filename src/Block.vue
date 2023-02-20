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
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  }
}
</script>