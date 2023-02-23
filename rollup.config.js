import vue from 'rollup-plugin-vue'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'

export default [
  {
    input: 'src/index.js',
    output: [
      {
        format: 'esm',
        file: 'dist/index.js'
      }
    ],
    external: ['@flyodev/nitrocms-js', 'pinia'],
    plugins: [
      vue(), peerDepsExternal()
    ]
  }
]