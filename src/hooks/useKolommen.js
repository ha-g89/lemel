import { useMemo, useState } from 'react'

/**
 * Welke kolommen van een databasetabel zichtbaar zijn, voor de vinkjes onder
 * de zoekbalk (lenzen en concerten).
 * @param {[string, string][]} kolommen [sleutel, kop] per kolom, op volgorde
 * @param {string[]} [standaardVerborgen] kolommen die bij het openen uit staan
 * @returns {{ toon: Object<string, boolean>, zichtbareKolommen: [string, string][], wisselKolom: Function }}
 */
export function useKolommen(kolommen, standaardVerborgen = []) {
  const [verborgen, zetVerborgen] = useState(standaardVerborgen)
  const toon = useMemo(() => Object.fromEntries(kolommen.map(([k]) => [k, !verborgen.includes(k)])), [kolommen, verborgen])
  const zichtbareKolommen = kolommen.filter(([k]) => toon[k])
  function wisselKolom(kolom) {
    zetVerborgen((v) => (v.includes(kolom) ? v.filter((k) => k !== kolom) : [...v, kolom]))
  }
  return { toon, zichtbareKolommen, wisselKolom }
}
