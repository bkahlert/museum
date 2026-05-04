import sharp from 'sharp'
import { readdir, stat } from 'node:fs/promises'
import { join, extname, basename } from 'node:path'

const DIR = new URL('../public/references', import.meta.url).pathname
const QUALITY = 82

const files = await readdir(DIR)
const images = files.filter((f) => /\.(png|jpe?g)$/i.test(f))

let converted = 0
let skipped = 0

for (const file of images) {
  const src = join(DIR, file)
  const dest = join(DIR, basename(file, extname(file)) + '.webp')

  const [srcStat, destStat] = await Promise.all([
    stat(src),
    stat(dest).catch(() => null),
  ])

  if (destStat && destStat.mtimeMs >= srcStat.mtimeMs) {
    skipped++
    continue
  }

  await sharp(src).webp({ quality: QUALITY }).toFile(dest)
  const { size } = await stat(dest)
  console.log(`  ${file} → ${basename(dest)} (${(size / 1024).toFixed(0)} KB)`)
  converted++
}

console.log(`\nDone: ${converted} converted, ${skipped} already up to date.`)
