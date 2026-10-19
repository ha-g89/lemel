/* patchnotes: wat er per dag op de site is veranderd, nieuwste bovenaan.
   datum als 'jjjj-mm-dd'. hier blijft de hele geschiedenis staan; in
   patchnotes.txt (start-menu, instellingen) staat alleen de laatste patch. */
const PATCHNOTES = [
  {
    datum: '2026-10-19',
    punten: [
      'inspiratie: de gifjes zijn een stuk kleiner gemaakt, dus de pagina laadt sneller.',
      'gallerij, database, concerten en inspiratie: de vensters hebben nu knoppen om te minimaliseren, maximaliseren en sluiten. een gesloten venster krijg je terug via het start-menu.',
      'taakbalk: icoon en tekst staan nu netjes in het midden van de knop van een open venster.',
      'taakbalk: klik met de rechtermuisknop op een venster om het te herstellen, minimaliseren, maximaliseren of sluiten.',
      'taakbalk: open je een andere pagina, dan blijft de vorige als knop in de taakbalk staan en kun je er zo naar terug. pas als de taakbalk vol is gaat de pagina die je het langst niet gebruikt hebt vanzelf dicht.',
      'database en concerten: in de titelbalk en de taakbalk staat nu gewoon lenzen.db en concerten.db.',
      'concerten: de groene knop speelt het liedje af, klik op de titel en het opent in de spotify-app.',
      'concerten: pendulum staat erbij op 19 februari 2027 in afas live.',
      'leesmij: uitleg over de wereldbol en de naar boven-knop erbij.',
      'concerten: de datumkolom staat standaard uit. zet hem aan met het vinkje datum.',
      'database en concerten: een geselecteerd zoekveld of keuzelijst heeft nu een groene gloed in plaats van een hard groen randje.',
    ],
  },
  {
    datum: '2026-10-16',
    punten: [
      'op de telefoon lopen de vensters en de taakbalk nu van rand tot rand.',
      'inspiratie: drie nieuwe gifjes erbij.',
      'inspiratie: de gifjes lopen nu ook op de iphone steeds opnieuw rond.',
      'inspiratie: bij vorige en volgende in het venster zie je geen lege grijze balk meer, het gifje wisselt meteen.',
    ],
  },
  {
    datum: '2026-10-15',
    punten: [
      "startpagina: de foto's staan nu in een eigen venster, vijf naast elkaar. alles is wat breder geworden.",
      'boven en onder de wereldbol zit nu evenveel ruimte, dus alles staat wat hoger op de pagina.',
      'inspiratie: zeventien nieuwe gifjes erbij.',
      "foto's en inspiratie: de tegels staan dichter op elkaar.",
      'inspiratie: de gifjes zijn zwart-wit.',
      'patchnotes.txt: het zwarte lijntje boven het icoontje is weg.',
      "taakbalk: \"naar boven\" is nu een knop in de taakbalk, net als een geminimaliseerd venster. klik erop en hij blijft ingedrukt tot je weer naar beneden gaat. het icoontje op het bureaublad is weg.",
      'start-menu: leesmij en patchnotes staan nu onder instellingen, over mij staat onder inspiratie. ze werken op elke pagina en het bureaublad van de startpagina is leeg.',
      'taakbalk: klik op het boompje en je kunt doneren aan natuurmonumenten.',
      'taakbalk: de smiley doet nu ook iets. klik maar.',
      'taakbalk: het computertje gaat nu naar linkedin. instagram vind je onderaan de pagina.',
      "inspiratie: klik op een tegel en hij opent in een eigen venster, net als de foto's. bij sommige staat een (?) met een tekstje erbij.",
      'achter de schermen: code opgeruimd.',
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
