import { describe, it, expect } from 'vitest'
import config from '../vite.config.js'

// Regression guard: @flyo/nitro-js-bridge was bundled into dist until 2.4.0, which froze
// the bridge version at nitro-vue3 release time. Sites could bump the bridge in their own
// lockfile without any effect — the inlined copy kept running, so bridge features shipped
// after that release (e.g. the >= 1.4.0 editor connection handshake) never reached them.
describe('vite library build', () => {
  it('keeps every @flyo runtime dependency external', () => {
    expect(config.build.rollupOptions.external).toEqual([
      'vue',
      '@flyo/nitro-typescript',
      '@flyo/nitro-js-bridge'
    ])
  })
})
