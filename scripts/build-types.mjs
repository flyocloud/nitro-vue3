import { copyFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

const source = resolve(process.cwd(), 'src/index.d.ts')
const target = resolve(process.cwd(), 'dist/index.d.ts')

await mkdir(dirname(target), { recursive: true })
await copyFile(source, target)
