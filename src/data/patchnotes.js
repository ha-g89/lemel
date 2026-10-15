/* patchnotes: wat er per dag op de site is veranderd, nieuwste bovenaan.
   datum als 'jjjj-mm-dd'. hier blijft de hele geschiedenis staan; in
   patchnotes.txt op de startpagina (bureaubladicoon onderaan) staat alleen
   de laatste patch. */
export const PATCHNOTES = [
  {
    datum: '2026-10-15',
    punten: [
      'inspiratie: zestien nieuwe gifjes erbij.',
      "foto's en inspiratie: de tegels staan dichter op elkaar.",
      'inspiratie: de gifjes zijn zwart-wit.',
      "inspiratie: klik op een tegel en hij opent in een eigen venster, net als de foto's. bij sommige staat een (?) met een tekstje erbij.",
    ],
  },
  {
    datum: '2026-10-14',
    punten: [
      "nieuw: inspiratie in het start-menu, met een eigen icoontje. hier komen foto's en gifjes die mij inspireren.",
      'concerten: met de vinkjes onder de zoekbalk zet je kolommen aan en uit, net als bij de database.',
    ],
  },
  {
    datum: '2026-10-13',
    punten: [
      'nieuw: patchnotes.txt, waarin je kunt lezen wat er per dag verandert.',
      'nieuw: "naar boven!!" onderaan elke pagina. dubbelklik en je rolt rustig terug naar boven.',
      'startpagina: de iconen onderaan staan wat ruimer uit elkaar.',
      'database: kroon- en oogtegeltjes voor in bezit en op kijklijst.',
      'database: prijzen staan met het juiste valutateken, dus $ in plaats van USD.',
      'database: met de vinkjes onder de zoekbalk zet je kolommen aan en uit. standaard staan merk, vatting en status aan.',
      'zoekveld en keuzelijsten in windows 98-stijl, met een strak pijltje dat ingedrukt blijft zolang de lijst openstaat.',
      'schuifbalken in de vensters in windows 98-stijl, met knopjes en een geblokt spoor.',
      'concerten: op de telefoon speelt het favo liedje in een klein spelervenster onderaan.',
      'concerten: khalid erbij (afas live, 12-10-2026), dmx eraf.',
      'concerten: "nu speelt" loopt als een lichtkrant door de statusbalk.',
      'achter de schermen: code opgeruimd.',
    ],
  },
]

/* de laatste patch (hoogste datum) als platte tekst voor het kladblok-venster */
export function patchnotesTekst() {
  const { datum, punten } = PATCHNOTES.reduce((a, b) => (b.datum > a.datum ? b : a))
  const [j, m, d] = datum.split('-')
  return `${d}-${m}-${j}\n` + punten.map((p) => '- ' + p).join('\n')
}
