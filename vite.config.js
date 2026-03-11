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
      external: ['vue', '@flyo/nitro-typescript'],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue',
          '@flyo/nitro-typescript': 'FlyoNitroTypescript'
        }
      }
    }
  },
  test: {
    environment: 'happy-dom',
    globals: true
  }
})
