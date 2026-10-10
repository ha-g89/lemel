/* Maakt kleine webp-versies van de foto's in src/assets/kluis voor de fotogrid
   (de lightbox blijft de grote versie gebruiken). Slaat foto's over waarvan de
   thumbnail al bestaat en nieuwer is, en ruimt thumbnails op van foto's die
   hernoemd of weggehaald zijn. Draait vanzelf vóór "npm run dev".
   Gebruik: node scripts/maak-thumbnails.mjs */
import sharp from 'sharp'
import { readdir, stat, mkdir, unlink } from 'node:fs/promises'
import path from 'node:path'

const bron = 'src/assets/kluis'
const doel = 'src/assets/kluis-klein'
/* grid-kolom is meestal 125-350 css-px breed; 600 is scherp genoeg op retina */
const BREEDTE = 600

await mkdir(doel, { recursive: true })

const fotos = (await readdir(bron)).filter((n) => /\.(jpe?g|png)$/i.test(n))
const verwacht = new Set()
let gemaakt = 0

for (const naam of fotos) {
  const thumb = naam.replace(/\.[^.]+$/, '') + '.webp'
  verwacht.add(thumb)
  const van = path.join(bron, naam)
  const naar = path.join(doel, thumb)
  const [a, b] = await Promise.all([stat(van), stat(naar).catch(() => null)])
  if (b && b.mtimeMs >= a.mtimeMs) continue
  await sharp(van)
    .rotate()
    .resize({ width: BREEDTE, withoutEnlargement: true })
    .webp({ quality: 68 })
    .toFile(naar)
  gemaakt++
  console.log(`thumbnail: ${thumb}`)
}

let weg = 0
for (const naam of await readdir(doel)) {
  if (!verwacht.has(naam)) {
    await unlink(path.join(doel, naam))
    weg++
  }
}

if (gemaakt || weg) console.log(`thumbnails: ${gemaakt} gemaakt, ${weg} opgeruimd`)
