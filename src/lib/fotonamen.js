import { LENS_NAAM, THEMA_NAAM } from '../data/lenzen.js'

/* zoekt een code (lens of thema) ergens achter de naam */
export function codeVan(bestand, lijst) {
  const delen = bestand.split('_')
  for (let i = 1; i < delen.length; i++) {
    for (let n = delen.length; n > i; n--) {
      const kandidaat = delen.slice(i, n).join('-')
      if (lijst[kandidaat]) return kandidaat
    }
    if (lijst[delen[i]]) return delen[i]
  }
  return null
}

export function lensVan(bestand) {
  return codeVan(bestand, LENS_NAAM)
}

export function themaVan(bestand) {
  return codeVan(bestand, THEMA_NAAM)
}

/* naam zonder lens- en themacode */
export function schoneNaam(bestand) {
  let naam = bestand
  for (const code of [lensVan(naam), themaVan(naam)]) {
    if (!code) continue
    naam = naam.replace('_' + code.replace(/-/g, '_'), '').replace('_' + code, '')
  }
  return naam
}

/* Mogelijke bestandsnamen: zoals opgegeven, zonder lenscode, en met elke lenscode erachter.
   Zo blijft de foto werken of je 'm nu wel of niet hernoemd hebt. */
export function naamVarianten(basis) {
  const kaal = schoneNaam(basis)
  const lijst = [basis]
  const voegtoe = (n) => {
    if (lijst.indexOf(n) === -1) lijst.push(n)
  }
  voegtoe(kaal)
  for (const t in THEMA_NAAM) voegtoe(kaal + '_' + t)
  for (const l in LENS_NAAM) {
    voegtoe(kaal + '_' + l)
    for (const t2 in THEMA_NAAM) voegtoe(kaal + '_' + l + '_' + t2)
  }
  return lijst
}

/* zoekterm voor eBay: zonder haakjes, umlaut weg */
export function zoekterm(naam) {
  return naam.replace(/\([^)]*\)/g, '').replace(/ä/g, 'a').replace(/\s+/g, ' ').trim()
}

export function ebayZoeklink(naam) {
  return 'https://www.ebay.nl/sch/i.html?_nkw=' + encodeURIComponent(zoekterm(naam))
}
