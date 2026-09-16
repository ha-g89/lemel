import { LENS_NAAM, THEMA_NAAM } from '../data/lenzen.js'

/* zoekt een lenscode ergens achter de naam (een foto heeft er hooguit één) */
export function lensVan(bestand) {
  const delen = bestand.split('_')
  for (let i = 1; i < delen.length; i++) {
    for (let n = delen.length; n > i; n--) {
      const kandidaat = delen.slice(i, n).join('-')
      if (LENS_NAAM[kandidaat]) return kandidaat
    }
    if (LENS_NAAM[delen[i]]) return delen[i]
  }
  return null
}

/* zoekt alle themacodes achter de naam -- een foto mag in meerdere
   albums tegelijk staan, bv. een auto-foto uit Japan:
   MCA_1900_pentax-m-35_autos_jp26.JPG */
export function themasVan(bestand) {
  return bestand.split('_').filter((deel) => THEMA_NAAM[deel])
}

/* naam zonder lens- en themacode(s) */
export function schoneNaam(bestand) {
  let naam = bestand
  const codes = [lensVan(naam), ...themasVan(naam)]
  for (const code of codes) {
    if (!code) continue
    naam = naam.replace('_' + code.replace(/-/g, '_'), '').replace('_' + code, '')
  }
  return naam
}
