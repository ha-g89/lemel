/* zoeklink voor eBay: zonder haakjes, umlaut weg. Gedeeld tussen de
   fotonamen (gallerij) en de lenzendatabase, die allebei naar dezelfde
   eBay-zoekpagina linken voor een lensnaam. */
export function zoekterm(naam) {
  return naam.replace(/\([^)]*\)/g, '').replace(/ä/g, 'a').replace(/\s+/g, ' ').trim()
}

export function ebayZoeklink(naam) {
  return 'https://www.ebay.nl/sch/i.html?_nkw=' + encodeURIComponent(zoekterm(naam))
}
