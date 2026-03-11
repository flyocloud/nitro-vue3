# [2.1.0](https://github.com/flyocloud/nitro-vue3/compare/v2.0.0...v2.1.0) (2026-03-11)


### Features

* add TypeScript definitions and build script for types ([338c6f1](https://github.com/flyocloud/nitro-vue3/commit/338c6f1660a54ecdb6694587056f9b6681bae955))

# [2.0.0](https://github.com/flyocloud/nitro-vue3/compare/v1.0.0...v2.0.0) (2026-03-11)


### chore

* prepare for version 2.0.0 ([93f6e94](https://github.com/flyocloud/nitro-vue3/commit/93f6e941819593eb7f9d9c92f4276bf1a35ed77b))


### BREAKING CHANGES

* Major version bump

# 1.0.0 (2026-03-11)


* feat!: migrate to @flyo/nitro-typescript SDK, switch build to vite ([d33d8e4](https://github.com/flyocloud/nitro-vue3/commit/d33d8e4a073304df1fd106c49980cdf567e5e82e))


### chore

* prepare for version 2.0.0 ([93f6e94](https://github.com/flyocloud/nitro-vue3/commit/93f6e941819593eb7f9d9c92f4276bf1a35ed77b))


### BREAKING CHANGES

* Major version bump
* The underlying SDK has changed from @flyo/nitro-js to
@flyo/nitro-typescript. The internal API initialisation now uses the
Configuration class instead of the singleton ApiClient.instance pattern.
The EntitiesApi method was renamed from entity(uniqueid) to
entityByUniqueid({ uniqueid }) to match the new SDK contract. The build
output is now dual-format ESM (dist/index.mjs) and CJS (dist/index.cjs)
instead of the previous single dist/index.js ESM file — update any
explicit imports that referenced the old path.

- remove yarn.lock; project now uses npm
- replace @flyo/nitro-js with @flyo/nitro-typescript ^1.4.0
- replace rollup + rollup-plugin-vue with vite + @vitejs/plugin-vue
- expose getFlyoConfig() helper so composables share one Configuration instance
- fix sitemap composable bug (sitemap.value was referencing undefined variable)
- add vitest test suite (23 passing tests covering all composables and api helper)
- add GitHub Actions test workflow (Node 20 & 22 matrix)
- add GitHub Actions release workflow with semantic-release (auto npm publish)
- add .releaserc.json with changelog, npm, git and github plugins
- update .gitignore with dist/, logs, env and editor entries
- rewrite README with install guide, component and composable API reference

# 1.0.0 (2026-03-11)


* feat!: migrate to @flyo/nitro-typescript SDK, switch build to vite ([d33d8e4](https://github.com/flyocloud/nitro-vue3/commit/d33d8e4a073304df1fd106c49980cdf567e5e82e))


### BREAKING CHANGES

* The underlying SDK has changed from @flyo/nitro-js to
@flyo/nitro-typescript. The internal API initialisation now uses the
Configuration class instead of the singleton ApiClient.instance pattern.
The EntitiesApi method was renamed from entity(uniqueid) to
entityByUniqueid({ uniqueid }) to match the new SDK contract. The build
output is now dual-format ESM (dist/index.mjs) and CJS (dist/index.cjs)
instead of the previous single dist/index.js ESM file — update any
explicit imports that referenced the old path.

- remove yarn.lock; project now uses npm
- replace @flyo/nitro-js with @flyo/nitro-typescript ^1.4.0
- replace rollup + rollup-plugin-vue with vite + @vitejs/plugin-vue
- expose getFlyoConfig() helper so composables share one Configuration instance
- fix sitemap composable bug (sitemap.value was referencing undefined variable)
- add vitest test suite (23 passing tests covering all composables and api helper)
- add GitHub Actions test workflow (Node 20 & 22 matrix)
- add GitHub Actions release workflow with semantic-release (auto npm publish)
- add .releaserc.json with changelog, npm, git and github plugins
- update .gitignore with dist/, logs, env and editor entries
- rewrite README with install guide, component and composable API reference
