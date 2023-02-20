import { openBlock, createBlock, resolveDynamicComponent, resolveComponent, createElementBlock, renderSlot, normalizeProps, mergeProps, Fragment, renderList, createCommentVNode } from 'vue';

var script$1 = {
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  }
};

function render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createBlock(resolveDynamicComponent($props.item.component), {
    config: $props.item.config,
    content: $props.item.content,
    items: $props.item.items,
    slots: $props.item.slots
  }, null, 8 /* PROPS */, ["config", "content", "items", "slots"]))
}

script$1.render = render$1;
script$1.__file = "src/Block.vue";

var script = {
  components: { Block: script$1 },
  props: {
    page: {
      type: Object,
      default: false
    }
  },
};

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Block = resolveComponent("Block");

  return (openBlock(), createElementBlock("div", null, [
    ($props.page)
      ? renderSlot(_ctx.$slots, "default", normalizeProps(mergeProps({ key: 0 }, $props.page)), () => [
          (openBlock(true), createElementBlock(Fragment, null, renderList($props.page.json, (item) => {
            return (openBlock(), createBlock(_component_Block, {
              key: item.uid,
              item: item
            }, null, 8 /* PROPS */, ["item"]))
          }), 128 /* KEYED_FRAGMENT */))
        ])
      : createCommentVNode("v-if", true)
  ]))
}

script.render = render;
script.__file = "src/Page.vue";

export { script$1 as Block, script as Page };
