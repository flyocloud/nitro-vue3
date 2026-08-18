# Upgrading

## From v2.4 to v2.5

v2.5 moves the pinned SDKs forward and fixes live-edit outside the Flyo editor.
No component, composable, or plugin option changed its signature.

| Dependency | v2.4 | v2.5 |
| --- | --- | --- |
| `@flyo/nitro-typescript` | `^1.4.0` | `^1.7.0` |
| `@flyo/nitro-js-bridge` | `^1.4.0` | `^1.5.0` |

Both were already floating ranges, so an install of v2.4 made after those SDK
releases already picked them up. What follows is what actually reaches your
code.

### `useFlyoSitemap()` keeps an explicit `null` in `routes`

The API sends a `routes` map per sitemap item, carrying the resolved URL paths
plus a system key `_empty`. When `_empty` arrives as an explicit `null`, the SDK
used to drop the key; it now preserves it.

```js
const { response } = await useFlyoSitemap().fetch()

// v2.4: { }
// v2.5: { _empty: null }
response.value[1].routes
```

⚠️ **Check this** if you test the key's presence rather than its value —
`'_empty' in routes` and `Object.keys(routes).length` now see the key:

```js
// before
if ('_empty' in routes) { … }

// after — treats a missing key and an explicit null alike
if (routes._empty != null) { … }
```

Reading a route path (`routes.detail`) is unchanged, and `_empty: false` /
`_empty: true` were always passed through untouched.

### `routes` is typed `{ [key: string]: any }`

For TypeScript consumers of the exported response types:

| Type | v2.4 | v2.5 |
| --- | --- | --- |
| `FlyoSitemapResponse[number].routes` | `Routes` | `{ [key: string]: any }` |
| `FlyoEntityResponse.entity.routes` | `{ [key: string]: string }` | `{ [key: string]: any }` |

The old `{ [key: string]: string }` was wrong — `_empty` is a boolean — so
`routes._empty` no longer needs a cast to be used as one. Reading a path still
type-checks as a `string`, but you lose `string` inference on the values, so add
a guard where the key is dynamic:

```ts
const path = routes[key]
if (typeof path !== 'string') return undefined
```

The `Routes` type itself was removed from `@flyo/nitro-typescript`. This package
never re-exported it, so only a direct
`import type { Routes } from '@flyo/nitro-typescript'` in your own code stops
compiling — replace the annotation with `{ [key: string]: any }`.

### `liveEdit: true` outside the Flyo editor no longer errors

When live-edit was enabled on a page that is *not* rendered inside the Flyo
preview iframe, every re-wire and every unmount of `<FlyoPage>` posted an
`openEdit` message to the page's own window. The browser rejected it against the
editor's target origin and logged:

> Failed to execute 'postMessage' on 'DOMWindow': The target origin provided
> ('https://flyo.cloud') does not match the recipient window's origin (…).

`useFlyoLiveEdit()` now wires the hover affordance only when the page really is
embedded in the editor, so those errors are gone. Behaviour inside the editor is
unchanged.
