import { defineStore, createPinia } from 'pinia';
import { ApiClient, ConfigApi, EntitiesApi, PagesApi, SitemapApi } from '@flyodev/nitrocms-js';
import { openBlock, createBlock, resolveDynamicComponent, resolveComponent, createElementBlock, renderSlot, normalizeProps, mergeProps, Fragment, renderList, createCommentVNode, ref, inject } from 'vue';

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

const useFlyoConfig = defineStore('flyoConfig', () => {
	const isLoading = ref(null);
	const response = ref(null);
  const error = ref(null);

	const fetch = async () => {
		try {
      error.value = null;
      isLoading.value = true;
      response.value = await new ConfigApi().config();
      isLoading.value = false;
    } catch (e) {
			isLoading.value = false;
			response.value = null;
      error.value = e;
    }
	};

  return {
		response,
		isLoading,
    error,
		fetch
	}
});

const useFlyoContent = () => {
  const isEditable = (pageId, authentication) => {
    const { allowEdit } = inject('flyo');

    if (authentication && allowEdit) {
      return true
    }

    return false
  };

  const putContent = async (pageId, blockUid, contentIdentifier, authentication, newValue) => {
    try {
      const payload = {
        value: newValue,
        identifier: contentIdentifier,
        uid: blockUid,
        authentication
      };
      await new ConfigApi().putContent(pageId, {content: payload});
    } catch (e) {
      console.error(e);
    }
  };

  return {
    putContent,
    isEditable
  }
};

const useFlyoEntity = () => {
  const isLoading = ref(false);
  const response = ref(null);
  const error = ref(null);

  const fetch = async (uniqueid) => {
    try {
      error.value = null;
      isLoading.value = true;
      response.value = await new EntitiesApi().entity(uniqueid);
    } catch (e) {
      isLoading.value = false;
      response.value = null;
      error.value = e;
    }
  };

  return {
    isLoading,
    response,
    error,
    fetch
  }
};

const useFlyoPage = () => {
  const isLoading = ref(false);
  const response = ref(null);
  const error = ref(null);

  const fetch = async (slug) => {
    try {
      error.value = null;
      isLoading.value = true;
      response.value = await new PagesApi().page({ slug });
    } catch (e) {
      isLoading.value = false;
      response.value = null;
      error.value = e;
    }
  };

  const { putContent, isEditable } = useFlyoContent();

  return {
    isLoading,
    response,
    error,
    fetch,
    putContent,
    isEditable
  }
};

const useFlyoSitemap = () => {
  const isLoading = ref(false);
  const response = ref(null);
  const error = ref(null);

  const fetch = async () => {
    try {
      error.value = null;
      isLoading.value = true;
      response.value = await new SitemapApi().sitemap();
    } catch (e) {
      isLoading.value = false;
      sitemap.value = null;
      error.value = e;
    }
  };
  
  return {
    isLoading,
    response,
    error,
    fetch
  }
};

const FlyoVue = {
	install(Vue, options) {
		// Initialize the flyo api
		initFlyoApi(options);

	 	// Setup flyo components
		Vue.component(script$1.name, script$1);
		Vue.component(script.name, script);

		// Setup pinia store
		const pinia = createPinia();
		Vue.use(pinia);

		// Provide flyo object with configs and all endpoints.
		// Make sure to pass pinia if the composable is a store.
		Vue.provide('flyo', {
			allowEdit: options.allowEdit,
			config: useFlyoConfig(pinia),
			content: useFlyoContent(),
			entity: useFlyoEntity(),
			page: useFlyoPage(),
			sitemap: useFlyoSitemap()
		});
	}
};

export { script$1 as Block, FlyoVue, script as Page, FlyoVue as default, useFlyoConfig, useFlyoContent, useFlyoEntity, useFlyoPage, useFlyoSitemap };
