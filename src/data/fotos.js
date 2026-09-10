import { lensVan, themaVan, schoneNaam, naamVarianten } from '../lib/fotonamen.js'

/* ============================================================
   FOTO'S — zet hier de bestandsnamen (zonder extensie) uit de map
   src/assets/kluis. Wil je vastleggen met welke lens een foto is
   gemaakt? Hernoem het bestand in de map "kluis" met de lenscode
   erachter (zie src/data/lenzen.js). De naam hieronder mag kaal
   blijven: de site zoekt zelf het bestand met of zonder code.
   ============================================================ */
export const FOTOS = [
  'MCA_0194',
  'MCA_0278',
  'MCA_0302',
  'MCA_0323',
  'MCA_0330',
  'MCA_0385',
  'MCA_0392',
  'MCA_0406',
  'MCA_0411',
  'MCA_0422',
  'MCA_0423',
  'MCA_0424',
  'MCA_0427',
  'MCA_0455',
  'MCA_0471',
  'MCA_0473',
  'MCA_0475',
  'MCA_0480',
  'MCA_0482',
  'MCA_0485',
  'MCA_0515',
  'MCA_0538',
  'MCA_0562',
  'MCA_0582',
  'MCA_0585',
  'MCA_0593',
  'MCA_0598',
  'MCA_0618',
  'MCA_0633',
  'MCA_0642',
  'MCA_0705',
  'MCA_0708',
  'MCA_0711',
  'MCA_0719',
  'MCA_0722',
  'MCA_0733',
  'MCA_0740',
  'MCA_0751',
  'MCA_0757',
  'MCA_0789',
  'MCA_0796',
  'MCA_0849',
  'MCA_0862',
  'MCA_0870',
  'MCA_0935',
  'MCA_1021',
  'MCA_1036',
  'MCA_1045',
  'MCA_1058',
  'MCA_1078',
  'MCA_1079',
  'MCA_1085',
  'MCA_1096',
  'MCA_1119',
  'MCA_1123',
  'MCA_1127',
  'MCA_1170',
  'MCA_1181',
  'MCA_1182',
  'MCA_1186',
  'MCA_1187',
  'MCA_1207',
  'MCA_1226',
  'MCA_1241',
  'MCA_1287',
  'MCA_1303',
  'MCA_1324',
  'MCA_1347',
  'MCA_1383',
  'MCA_1384',
  'MCA_1386',
  'MCA_1429',
  'MCA_1504',
  'MCA_1550',
  'MCA_1552',
  'MCA_1556',
  'MCA_1561',
  'MCA_1581',
  'MCA_1599',
  'MCA_1618',
  'MCA_1628',
  'MCA_1692',
  'MCA_1705',
  'MCA_1727',
  'MCA_1741',
  'MCA_1746',
  'MCA_1775',
  'MCA_1788',
  'MCA_1790',
  'MCA_1802',
  'MCA_1812',
  'MCA_1817',
  'MCA_1821',
  'MCA_1825',
]

/* Alle bestanden in de kluis, opgezocht door Vite. Sleutel: naam zonder
   extensie in kleine letters, zodat .jpg en .JPG allebei werken. */
const bestanden = import.meta.glob('../assets/kluis/*.{jpg,JPG,jpeg,JPEG,png,PNG}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const perNaam = {}
for (const pad in bestanden) {
  const bestandsnaam = pad.split('/').pop()
  const naam = bestandsnaam.replace(/\.[^.]+$/, '')
  perNaam[naam.toLowerCase()] = { naam, url: bestanden[pad] }
}

/* Zoekt voor elke opgegeven naam het echte bestand: eerst zoals opgegeven,
   daarna zonder code en met elke lens-/themacode erachter. */
function zoekBestand(basis) {
  for (const variant of naamVarianten(basis)) {
    const hit = perNaam[variant.toLowerCase()]
    if (hit) return hit
  }
  return null
}

export const FOTOLIJST = FOTOS.map((basis) => {
  const hit = zoekBestand(basis)
  const bestand = hit ? hit.naam : basis
  return {
    basis,
    bestand,
    url: hit ? hit.url : null,
    lens: lensVan(bestand),
    thema: themaVan(bestand),
    naam: schoneNaam(bestand),
  }
})
