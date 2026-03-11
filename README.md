# @flyo/nitro-vue3

Vue 3 integration for [Flyo Nitro](https://github.com/flyocloud/nitro-typescript-sdk) — build Vue 3 sites powered by the Flyo CMS with ready-made components and composables.

## Installation

```bash
npm install @flyo/nitro-vue3
```

## Setup

Register the plugin in your Vue application entry point. You need a Flyo API token from your Nitro configuration.

```js
import { createApp } from 'vue'
import { FlyoVue } from '@flyo/nitro-vue3'
import App from './App.vue'

const app = createApp(App)

app.use(FlyoVue, {
  apiToken: 'YOUR_FLYO_API_TOKEN',
  // optional: override the API base URL
  // apiBasePath: 'https://api.flyo.cloud/nitro/v1',
  // optional: additional default request headers
  // defaultHeaders: {},
  // optional: enable live-edit mode (for use inside the Flyo preview iframe)
  liveEdit: false,
  liveEditOrigin: 'https://flyo.cloud'
})

app.mount('#app')
```

## Components

Both components are globally registered when you call `app.use(FlyoVue, ...)`.

### `<FlyoPage>`

Renders the blocks of a page returned by `useFlyoPage`. It handles the live-edit postMessage bridge automatically, so editors can preview changes in real time inside the Flyo UI.

**Props**

| Prop | Type | Default | Description |
|---|---|---|---|
| `page` | `Object \| Boolean` | `false` | The page object returned by `useFlyoPage().fetch()` |

**Events**

| Event | Payload | Description |
|---|---|---|
| `update:page` | updated page | Emitted when the Flyo live-edit bridge pushes a new page state |

**Example**

```vue
<script setup>
import { useFlyoPage } from '@flyo/nitro-vue3'

const { response: page, fetch } = useFlyoPage('about-us')
await fetch()
</script>

<template>
  <FlyoPage v-model:page="page" />
</template>
```

You can also use the default slot to wrap the output:

```vue
<FlyoPage :page="page">
  <template #default="{ json }">
    <FlyoBlock v-for="item in json" :key="item.uid" :item="item" />
  </template>
</FlyoPage>
```

---

### `<FlyoBlock>`

Renders a single content block by resolving the block's `component` name to a locally or globally registered Vue component and passing all block data as props.

**Props**

| Prop | Type | Default | Description |
|---|---|---|---|
| `item` | `Object` | `{}` | A block object from `page.json` |

The resolved component receives: `config`, `content`, `items`, and `slots`.

**Example**

```vue
<FlyoBlock :item="item" />
```

---

## Composables

### `useFlyoConfig()`

Fetches the global Nitro config (navigation containers, available slugs, globals).

```js
import { useFlyoConfig } from '@flyo/nitro-vue3'

const { isLoading, response, error, fetch } = useFlyoConfig()

// fetch once on mount
await fetch()

console.log(response.value) // ConfigResponse
```

---

### `useFlyoPage(slug)`

Fetches a page by its slug.

```js
import { useFlyoPage } from '@flyo/nitro-vue3'

const { isLoading, response, error, fetch } = useFlyoPage('about-us')

await fetch()

console.log(response.value) // Page object with .json blocks, meta info, etc.
```

---

### `useFlyoEntity(uniqueid)`

Fetches a single entity by its Nitro unique identifier.

```js
import { useFlyoEntity } from '@flyo/nitro-vue3'

const { isLoading, response, error, fetch } = useFlyoEntity('my-blog-entry-uid')

await fetch()

console.log(response.value) // Entity fields
```

---

### `useFlyoSitemap()`

Fetches the full sitemap — all pages and mapped entities including their resolved `href` paths.

```js
import { useFlyoSitemap } from '@flyo/nitro-vue3'

const { isLoading, response, error, fetch } = useFlyoSitemap()

await fetch()

console.log(response.value) // Array of sitemap items
```

---

## Composable return values

Every composable returns the same reactive shape:

| Key | Type | Description |
|---|---|---|
| `isLoading` | `Ref<boolean \| null>` | `true` while the request is in flight |
| `response` | `Ref<T \| null>` | The response data, `null` until fetched |
| `error` | `Ref<any \| null>` | The error object if the request failed |
| `fetch` | `async () => { response, error }` | Call this to trigger the request |

---

## Live-edit support

When your site is embedded in the Flyo preview iframe, `FlyoPage` automatically listens for `pageRefresh` messages and emits `update:page` so your component can reactively update without a full reload. Enable this by passing `liveEdit: true` to the plugin options.

---

## Releases

This package uses [semantic-release](https://github.com/semantic-release/semantic-release) — versions are bumped automatically based on [Conventional Commits](https://www.conventionalcommits.org/):

| Commit prefix | Release type |
|---|---|
| `fix:` | Patch (`1.0.x`) |
| `feat:` | Minor (`1.x.0`) |
| `feat!:` / `BREAKING CHANGE` | Major (`x.0.0`) |

## License

MIT
