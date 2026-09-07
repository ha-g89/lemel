/* Maakt webversies van de originele foto's: lange zijde 2400 px, JPEG 85,
   progressive, zonder metadata. Bestandsnamen (met lenscodes) blijven gelijk.
   Gebruik: node scripts/verklein-fotos.mjs [bronmap] */
import sharp from 'sharp'
import { readdir, stat, mkdir } from 'node:fs/promises'
import path from 'node:path'

const bron = process.argv[2] || 'C:/Users/haci_/Desktop/gare site mel/kluis'
const doel = 'src/assets/kluis'
const LANGE_ZIJDE = 2400

await mkdir(doel, { recursive: true })
let totaalIn = 0
let totaalUit = 0

for (const naam of (await readdir(bron)).sort()) {
  if (!/\.jpe?g$/i.test(naam)) continue
  const van = path.join(bron, naam)
  const naar = path.join(doel, naam)
  await sharp(van)
    .rotate() /* EXIF-oriëntatie toepassen, daarna metadata weglaten */
    .resize({ width: LANGE_ZIJDE, height: LANGE_ZIJDE, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 85, progressive: true, mozjpeg: true })
    .toFile(naar)
  const [a, b] = await Promise.all([stat(van), stat(naar)])
  totaalIn += a.size
  totaalUit += b.size
  console.log(`${naam}  ${(a.size / 1e6).toFixed(1)} MB -> ${(b.size / 1e3).toFixed(0)} KB`)
}
console.log(`\ntotaal: ${(totaalIn / 1e9).toFixed(2)} GB -> ${(totaalUit / 1e6).toFixed(1)} MB`)
