<template>
    <div>
        <slot
            v-if="page"
            v-bind="page"
        >
            <Block
                v-for="item in page.json"
                :key="item.uid"
                :item="item"
            />
        </slot>
    </div>
</template>

<script>
import Block from './Block.vue'
export default {
    components: { Block },
    props: {
        page: {
            type: Object,
            default: false
        }
    },
}
</script>