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
				@click="() => openFlyoEdit(item)"
      />
    </slot>
  </div>
</template>

<script setup>
	const props = defineProps({
		page:  {
			type: [Object, Boolean],
			default: false
		}
	})

	const openFlyoEdit = (item) => {
		if (process.client) {
			window.postMessage({
				action: 'openEdit',
				data: JSON.parse(JSON.stringify({
					page: props.page,
					item: item
				}))
			})
		}
	}

	if (process.client) {
		window.addEventListener("message", (event) => {
			// Do we trust the sender of this message?  (might be
			// different from what we originally opened, for example).
			// if (event.origin !== "http://example.com")
			// 	return;
			console.log({ event })
		});
	}
</script>

<script>
	export default {
		name: 'FlyoPage'
	}
</script>