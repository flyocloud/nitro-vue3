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
    external: ['@flyo/nitro-js'],
    plugins: [
      vue(), peerDepsExternal()
    ]
  }
]