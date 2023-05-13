import { ApiClient, ConfigApi, EntitiesApi, PagesApi, SitemapApi } from '@flyodev/nitrocms-js';
import { openBlock, createBlock, resolveDynamicComponent, inject, resolveComponent, createElementBlock, renderSlot, normalizeProps, mergeProps, Fragment, renderList, createCommentVNode, reactive, toRefs, ref, unref } from 'vue';

const initFlyoApi = ({ apiToken, apiBasePath, defaultHeaders }) => {
  const defaultClient = ApiClient.instance;
  defaultClient.defaultHeaders = defaultHeaders || {};

	if (apiBasePath) {
		defaultClient.basePath = apiBasePath;
	}

  const ApiKeyAuth = defaultClient.authentications["ApiKeyAuth"];
  ApiKeyAuth.apiKey = apiToken;
};

const __default__$1 = {
  name: 'FlyoBlock'
};


var script$1 = /*#__PURE__*/Object.assign(__default__$1, {
  props: {
  item: {
    type: Object,
    default: () => { }
  }
},
  setup(__props) {



return (_ctx, _cache) => {
  return (openBlock(), createBlock(resolveDynamicComponent(__props.item.component), {
    config: __props.item.config,
    content: __props.item.content,
    items: __props.item.items,
    slots: __props.item.slots
  }, null, 8 /* PROPS */, ["config", "content", "items", "slots"]))
}
}

});

script$1.__file = "src/components/Block.vue";

const __default__ = {
  name: 'FlyoPage'
};


var script = /*#__PURE__*/Object.assign(__default__, {
  props: {
  page: {
    type: [Object, Boolean],
    default: false
  }
},
  emits: ['update:page'],
  setup(__props, { emit: emits }) {

const props = __props;





const { liveEdit, liveEditOrigin } = inject('flyo');

const parentWindow = window => {
  const parentWindow = window.parent || window.opener;
  if (window.self === parentWindow) {
    return false
  }

  return window.parent || window.opener;
};

const openFlyoEdit = (item) => {
  if (!liveEdit) {
    return
  }

  if (process.client && parentWindow(window)) {
    parentWindow(window).postMessage({
      action: 'openEdit',
      data: JSON.parse(JSON.stringify({
        page: props.page,
        item: item
      }))
    }, liveEditOrigin);
  }
};

if (process.client && parentWindow(window)) {
  window.addEventListener("message", (event) => {
    if (event.origin !== liveEditOrigin) {
      console.log(`Message from ${event.origin} blocked. Expected ${liveEditOrigin}.`);
      return
    }

    const message = event.data;
    if (message.action === 'pageRefresh') {
      emits('update:page', message.data);

      /*
      const itemIndex = props.page.json.findIndex(item => item.uid === data.uid)
      props.page.json[itemIndex] = {
        ...props.page.json[itemIndex],
        ...data
      }
      */
    }
  });
}

return (_ctx, _cache) => {
  const _component_FlyoBlock = resolveComponent("FlyoBlock");

  return (openBlock(), createElementBlock("div", null, [
    (__props.page)
      ? renderSlot(_ctx.$slots, "default", normalizeProps(mergeProps({ key: 0 }, __props.page)), () => [
          (openBlock(true), createElementBlock(Fragment, null, renderList(__props.page.json, (item) => {
            return (openBlock(), createBlock(_component_FlyoBlock, {
              key: item.uid,
              item: item,
              onClick: () => openFlyoEdit(item)
            }, null, 8 /* PROPS */, ["item", "onClick"]))
          }), 128 /* KEYED_FRAGMENT */))
        ])
      : createCommentVNode("v-if", true)
  ]))
}
}

});

script.__file = "src/components/Page.vue";

const flyoConfigState = reactive({
	isLoading: null,
	response: null,
	error: null
});

const useFlyoConfig = () => {
	const fetch = async () => {
		try {
      flyoConfigState.error = null;
      flyoConfigState.isLoading = true;
      flyoConfigState.response = JSON.parse(JSON.stringify(await new ConfigApi().config()));
      flyoConfigState.isLoading = false;
    } catch (e) {
			flyoConfigState.isLoading = false;
			flyoConfigState.response = null;
      flyoConfigState.error = JSON.parse(JSON.stringify(e));
    }

		return {
			response: flyoConfigState.response,
			error: flyoConfigState.error
		}
	};

  return {
		...toRefs(flyoConfigState),
		fetch
	}
};

const useFlyoEntity = (uniqueid) => {
  const isLoading = ref(false);
  const response = ref(null);
  const error = ref(null);

  const fetch = async () => {
    try {
      error.value = null;
      isLoading.value = true;
      response.value = JSON.parse(JSON.stringify(await new EntitiesApi().entity(uniqueid)));
    } catch (e) {
      isLoading.value = false;
      response.value = null;
      error.value = JSON.parse(JSON.stringify(e));
    }

		return {
			response: unref(response),
			error: unref(error)
		}
  };

  return {
    isLoading,
    response,
    error,
    fetch
  }
};

const useFlyoPage = (slug) => {
  const isLoading = ref(false);
  const response = ref(null);
  const error = ref(null);

  const fetch = async () => {
    try {
      error.value = null;
      isLoading.value = true;
      response.value = JSON.parse(JSON.stringify(await new PagesApi().page({ slug })));
    } catch (e) {
      isLoading.value = false;
      response.value = null;
      error.value = JSON.parse(JSON.stringify(e));
    }

		return {
			response: unref(response),
			error: unref(error)
		}
  };

  return {
    isLoading,
    response,
    error,
    fetch
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
      response.value = JSON.parse(JSON.stringify(await new SitemapApi().sitemap()));
    } catch (e) {
      isLoading.value = false;
      sitemap.value = null;
      error.value = JSON.parse(JSON.stringify(e));
    }

		return {
			response: unref(response),
			error: unref(error)
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

		// Provide flyo object with global / persistent data
		Vue.provide('flyo', {
			liveEdit: options.liveEdit,
      		liveEditOrigin: options.liveEditOrigin
		});
	}
};

export { script$1 as Block, FlyoVue, script as Page, FlyoVue as default, useFlyoConfig, useFlyoEntity, useFlyoPage, useFlyoSitemap };
