import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'FlyoNitroVue3',
      formats: ['es', 'cjs'],
      fileName: (format) => format === 'es' ? 'index.mjs' : 'index.cjs'
    },
    rollupOptions: {
      // @flyo/nitro-js-bridge must stay external: bundling it would freeze the bridge
      // version into this dist, so consuming sites could never pick up a newer bridge
      // (e.g. the >= 1.4.0 editor connection handshake) without a nitro-vue3 release.
      external: ['vue', '@flyo/nitro-typescript', '@flyo/nitro-js-bridge'],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue',
          '@flyo/nitro-typescript': 'FlyoNitroTypescript',
          '@flyo/nitro-js-bridge': 'FlyoNitroJsBridge'
        }
      }
    }
  },
  test: {
    environment: 'happy-dom',
    globals: true
  }
})
