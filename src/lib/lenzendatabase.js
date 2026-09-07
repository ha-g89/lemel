import initSqlJs from 'sql.js'
import sqlWasmUrl from 'sql.js/dist/sql-wasm.wasm?url'

/* de SQLite-database staat in public/lenzendatabase/lenzen.db */
export const DB_PAD = 'lenzendatabase/lenzen.db'

const QUERY =
  'SELECT l.id, l.maker, l.model, l.mount, l.focal_mm, l.aperture_max, ' +
  '       l.aperture_min, l.year_from, l.year_to, l.weight_g, l.filter_mm, ' +
  '       l.min_focus_m, l.elements, l.groups_, l.blades, ' +
  '       c.status, ' +
  '       (SELECT p.price FROM prices p WHERE p.lens_id = l.id ORDER BY p.seen_at DESC LIMIT 1) AS laatste_prijs, ' +
  '       (SELECT p.currency FROM prices p WHERE p.lens_id = l.id ORDER BY p.seen_at DESC LIMIT 1) AS laatste_valuta, ' +
  '       (SELECT p.source FROM prices p WHERE p.lens_id = l.id ORDER BY p.seen_at DESC LIMIT 1) AS prijsbron, ' +
  '       (SELECT p.url FROM prices p WHERE p.lens_id = l.id ORDER BY p.seen_at DESC LIMIT 1) AS prijsurl, ' +
  '       (SELECT r.rating FROM reviews r WHERE r.lens_id = l.id ORDER BY r.seen_at DESC LIMIT 1) AS rating, ' +
  '       (SELECT r.scale_max FROM reviews r WHERE r.lens_id = l.id ORDER BY r.seen_at DESC LIMIT 1) AS rating_max, ' +
  '       (SELECT r.url FROM reviews r WHERE r.lens_id = l.id ORDER BY r.seen_at DESC LIMIT 1) AS reviewurl ' +
  'FROM lenses l LEFT JOIN collection c ON c.lens_id = l.id ' +
  'ORDER BY l.maker, l.model'

/**
 * Laadt lenzen.db via sql.js en geeft alle lenzen terug als objecten.
 * Gooit een fout als het bestand niet gevonden wordt.
 */
export async function laadLenzen() {
  /* cache-buster: dwingt de browser om altijd de nieuwste lenzen.db te downloaden,
     ook als een eerdere versie in de browsercache staat */
  const dbUrl = import.meta.env.BASE_URL + DB_PAD + '?v=' + Date.now()

  const SQL = await initSqlJs({ locateFile: () => sqlWasmUrl })
  const resp = await fetch(dbUrl, { cache: 'no-store' })
  if (!resp.ok) {
    throw new Error('kan ' + DB_PAD + ' niet vinden (status ' + resp.status + ')')
  }
  const buffer = await resp.arrayBuffer()
  const db = new SQL.Database(new Uint8Array(buffer))

  const query = db.exec(QUERY)
  db.close()
  if (!query.length) return []

  const kolommen = query[0].columns
  return query[0].values.map((rij) => {
    const obj = {}
    kolommen.forEach((naam, i) => {
      obj[naam] = rij[i]
    })
    return obj
  })
}

export function euro(bedrag, valuta) {
  if (bedrag === null || bedrag === undefined) return null
  const symbool = valuta === 'EUR' || !valuta ? '€' : valuta + ' '
  return symbool + Number(bedrag).toFixed(2).replace('.', ',')
}

export function ebayZoeklink(naam) {
  const term = naam.replace(/\([^)]*\)/g, '').replace(/\s+/g, ' ').trim()
  return 'https://www.ebay.nl/sch/i.html?_nkw=' + encodeURIComponent(term)
}

export function vergelijk(a, b, kolom) {
  let va = a[kolom]
  let vb = b[kolom]
  if (va === null || va === undefined) va = ''
  if (vb === null || vb === undefined) vb = ''
  if (typeof va === 'number' && typeof vb === 'number') return va - vb
  return String(va).localeCompare(String(vb))
}
