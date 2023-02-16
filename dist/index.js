'use strict';

var vue = require('vue');

var script$1 = {
    props: {
        item: {
            type: Object,
            default: () => {}
        }
    }
};

function render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.resolveComponent($props.item.component)), {
    config: $props.item.config,
    content: $props.item.content,
    items: $props.item.items,
    slots: $props.item.slots
  }, null, 8 /* PROPS */, ["config", "content", "items", "slots"]))
}

script$1.render = render$1;
script$1.__file = "src/Block.vue";

var script = {
    props: {
        page: {
            type: Object,
            default: false
        }
    },
};

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_FlyoBlock = vue.resolveComponent("FlyoBlock");

  return (vue.openBlock(), vue.createElementBlock("div", null, [
    ($props.page)
      ? vue.renderSlot(_ctx.$slots, "default", vue.normalizeProps(vue.mergeProps({ key: 0 }, $props.page)), () => [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($props.page.json, (item) => {
            return (vue.openBlock(), vue.createBlock(_component_FlyoBlock, {
              key: item.uid,
              item: item
            }, null, 8 /* PROPS */, ["item"]))
          }), 128 /* KEYED_FRAGMENT */))
        ])
      : vue.createCommentVNode("v-if", true)
  ]))
}

script.render = render;
script.__file = "src/Page.vue";

var index = { Block: script$1, Page: script };

module.exports = index;
