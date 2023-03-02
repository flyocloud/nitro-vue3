import { ApiClient, ConfigApi, PagesApi, EntitiesApi, SitemapApi } from '@flyodev/nitrocms-js';
import { openBlock, createBlock, resolveDynamicComponent, resolveComponent, createElementBlock, renderSlot, normalizeProps, mergeProps, Fragment, renderList, createCommentVNode, reactive, toRefs, inject, ref, unref } from 'vue';

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

const __default__$1 = {
		name: 'FlyoBlock'
	};


var script$1 = /*#__PURE__*/Object.assign(__default__$1, {
  props: {
		item:  {
			type: Object,
			default: () => {}
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
		page:  {
			type: [Object, Boolean],
			default: false
		}
	},
  setup(__props) {

const props = __props;

	

	const openFlyoEdit = (item) => {
		if (process.client) {
			window.postMessage({
				action: 'open-edit',
				data: JSON.parse(JSON.stringify({
					page: props.page,
					item: item
				}))
			});
		}
	};

	if (process.client) {
		window.addEventListener("message", (event) => {
			// Do we trust the sender of this message?  (might be
			// different from what we originally opened, for example).
			// if (event.origin !== "http://example.com")
			// 	return;
			console.log({ event });
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
              class: "test",
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
      flyoConfigState.error = e;
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

const useFlyoContent = (pageId, pageSlug) => {
  const { allowEdit } = inject('flyo');

  const isEditable = (authentication) => {
    if (authentication && allowEdit) {
      return true
    }

    return false
  };

  const putContent = async (blockUid, contentIdentifier, authentication, newValue) => {
    try {
      if (!pageId) {
        const page = await new PagesApi().page({ slug: pageSlug });
        pageId = page.id;
      }

      const payload = {
        value: newValue,
        identifier: contentIdentifier,
        uid: blockUid,
        authentication
      };
      return await new ConfigApi().putContent(pageId, {content: payload})
    } catch (e) {
      throw e
    }
  };

  return {
    putContent,
    isEditable
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
      error.value = e;
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
      error.value = e;
    }

		return {
			response: unref(response),
			error: unref(error)
		}
  };

	const { putContent, isEditable } = useFlyoContent(null, slug);

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
      response.value = JSON.parse(JSON.stringify(await new SitemapApi().sitemap()));
    } catch (e) {
      isLoading.value = false;
      sitemap.value = null;
      error.value = e;
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

		/* WIP
		// Setup edit directive
		Vue.directive('edit', {
			beforeMount(el) {
				el.setAttribute("contenteditable", true
				el.addEventListener('onChange', () => {
					console.log(el.originalValue)
				})
			},
			mounted(el) {
				el.originalValue = el.innerHtml
			}
		})*/

		// Provide flyo object with global / persistent data
		Vue.provide('flyo', {
			allowEdit: options.allowEdit
		});
	}
};

export { script$1 as Block, FlyoVue, script as Page, FlyoVue as default, useFlyoConfig, useFlyoContent, useFlyoEntity, useFlyoPage, useFlyoSitemap };
