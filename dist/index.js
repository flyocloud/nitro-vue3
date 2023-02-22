import { ConfigApi, PagesApi, EntitiesApi, SitemapApi, ContentApi, ApiClient } from '@flyodev/nitrocms-js';
import { openBlock, createBlock, resolveDynamicComponent, resolveComponent, createElementBlock, renderSlot, normalizeProps, mergeProps, Fragment, renderList, createCommentVNode, reactive, toRefs, inject, ref } from 'vue';

const initFlyoApi = ({ token, basePath, defaultHeaders }) => {
	const defaultClient = ApiClient.instance;
  defaultClient.defaultHeaders = defaultHeaders || {};

  // for development purposes change the base path to the api. must end with `.../nitro`
	// 'http://flyoapi-web-api.dev.heartbeat.gmbh:7171/nitro'
	if (basePath) {
		defaultClient.basePath = basePath;
	}

  const ApiKeyAuth = defaultClient.authentications["ApiKeyAuth"];
  ApiKeyAuth.apiKey = token;
};

const flyoConfigApi = new ConfigApi();
const flyoPagesApi = new PagesApi();
const flyoEntitiesApi = new EntitiesApi();
const flyoSitemapApi = new SitemapApi();
const flyoContentApi = new ContentApi();

var script$1 = {
  name: 'FlyoBlock',
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
script$1.__file = "src/components/Block.vue";

var script = {
  name: 'FlyoPage',
  props: {
    page: {
      type: Object,
      default: false
    }
  },
};

function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_FlyoBlock = resolveComponent("FlyoBlock");

  return (openBlock(), createElementBlock("div", null, [
    ($props.page)
      ? renderSlot(_ctx.$slots, "default", normalizeProps(mergeProps({ key: 0 }, $props.page)), () => [
          (openBlock(true), createElementBlock(Fragment, null, renderList($props.page.json, (item) => {
            return (openBlock(), createBlock(_component_FlyoBlock, {
              key: item.uid,
              item: item
            }, null, 8 /* PROPS */, ["item"]))
          }), 128 /* KEYED_FRAGMENT */))
        ])
      : createCommentVNode("v-if", true)
  ]))
}

script.render = render;
script.__file = "src/components/Page.vue";

const state = reactive({
  config: false,
  loading: true
});

/**
 * @see https://stackoverflow.com/a/69208479/4611030
 * @see https://nuxt.com/docs/guide/directory-structure/composables
 * @see https://vuejs.org/guide/reusability/composables.html
 */
const useFlyoConfig = () => {

  const fetchConfig = async () => {
    try {
      state.loading = true;
      state.config = await new ConfigApi().config();
      state.loading = false;
    } catch (e) {
      console.error(e);
    }

    return state.config
  };
  
  return {
    ...toRefs(state),
    fetchConfig
  }
};

const useFlyoContent = (pageId) => {
  const isEditable = (authentication) => {
    const allowEdit = inject('allowEdit');

    if (authentication && allowEdit) {
      return true
    }

    return false
  };

  const putContent = async (blockUid, contentIdentifier, authentication, newValue) => {
    try {
      const payload = {
        value: newValue,
        identifier: contentIdentifier,
        uid: blockUid,
        authentication
      };
      await flyoConfigApi.putContent(pageId, {content: payload});
    } catch (e) {
      console.error(e);
    }
  };

  return {
    putContent,
    isEditable
  }
};

const useFlyoEntity = async (uniqueid) => {
  const response = ref(null);

  try {
    response.value = await flyoEntitiesApi.entity(uniqueid);
  } catch (e) {
    response.value = false;
  }
  
  return {
    response: response
  }
};

/**
 * Resolves the page for a given route
 * @see https://stackoverflow.com/a/69208479/4611030
 * @see https://nuxt.com/docs/guide/directory-structure/composables
 * @see https://vuejs.org/guide/reusability/composables.html
 */
const useFlyoPage = async(slug) => {
  const page = ref(null);
  const error = ref(null);

  try {
    page.value = await flyoPagesApi.page({slug: slug});
  } catch (error) {
    error.value = error;
  }
  
  const { putContent, isEditable } = useFlyoContent(page.value.id);
  
  return {
    page: page,
    error: error,
    putContent,
    isEditable
  }
};

const useFlyoSitemap = async () => {

  const sitemap = ref(false);

  try {
    sitemap.value = await flyoSitemapApi.sitemap();
  } catch (e) {
    sitemap.value = false;
  }
  
  return {
    sitemap: sitemap
  }
};

const FlyoVue = {
	install(Vue, options) {
		Vue.provide('allowEdit', options.allowEdit);

		Vue.component(script$1.name, script$1);
		Vue.component(script.name, script);

		initFlyoApi(options);
	}
};

export { script$1 as Block, FlyoVue, script as Page, FlyoVue as default, flyoConfigApi, flyoContentApi, flyoEntitiesApi, flyoPagesApi, flyoSitemapApi, useFlyoConfig, useFlyoContent, useFlyoEntity, useFlyoPage, useFlyoSitemap };
