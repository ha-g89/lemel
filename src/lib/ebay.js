/* zoeklink voor eBay: zonder haakjes, umlaut weg. Gedeeld door de lightbox
   (gallerij), de lenzentabel en het eigenschappen-venster, die allemaal naar
   dezelfde eBay-zoekpagina linken voor een lensnaam. */
function zoekterm(naam) {
  return naam.replace(/\([^)]*\)/g, '').replace(/ä/g, 'a').replace(/\s+/g, ' ').trim()
}

export function ebayZoeklink(naam) {
  return 'https://www.ebay.nl/sch/i.html?_nkw=' + encodeURIComponent(zoekterm(naam))
}
