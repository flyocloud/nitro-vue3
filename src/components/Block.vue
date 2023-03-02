<template>
  <component
    :is="item.component"
    :config="item.config"
    :content="item.content"
    :items="item.items"
    :slots="item.slots"
  />
</template>

<script setup>
	const props = defineProps({
		item:  {
			type: Object,
			default: () => {}
		}
	})
</script>

<script>
	export default {
		name: 'FlyoBlock'
	}
</script>