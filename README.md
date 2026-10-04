# le mel

Fotosite met Windows-95-look, gebouwd in React + Vite. Begonnen als nabouw
van de oorspronkelijke HTML-pagina's, daarna uitgebreid met onder meer de
concertenpagina.

## Starten

```
npm install
npm run dev        # ontwikkelserver op http://localhost:5173
npm run build      # productieversie in dist/
npm run preview    # dist/ lokaal bekijken
```

## Pagina's

| route              | oud bestand           | wat                                          |
|--------------------|-----------------------|----------------------------------------------|
| `/`                | `index.html`          | gallerij met lightbox-vensters               |
| `/?lens=<code>`    | `index.html?lens=`    | alleen foto's met die lens                   |
| `/?thema=autos`    | `index.html?thema=`   | alleen foto's met dat thema                  |
| `/lenzendatabase`  | `lenzendatabase.html` | doorzoekbare SQLite-database via sql.js      |
| `/concerten`       | —                     | concerten met wikipedia-info, favo liedje (spotify) en leesmij.txt |

De oude pagina's kijklijst, rugzak en verkocht zijn opgeheven: die info staat
in de lenzendatabase (status in bezit / kijklijst / verkocht). Oude of
onbekende adressen gaan naar de gallerij.

Paaseieren: "scherminstellingen" onder instellingen in het Start-menu
(grijstinten, negatief, sepia) en typ ergens op de site "bsod".

## Foto's toevoegen

1. Zet het origineel in de map `kluis` op je bureaublad en draai
   `node scripts/verklein-fotos.mjs`. Dat maakt een webversie (lange zijde
   2400 px, JPEG 85, zonder metadata, ca. 0,5 tot 1 MB) in `src/assets/kluis/`.
   De originelen blijven waar ze staan en horen niet in git.
2. Wil je de lens vastleggen? Zet de lenscode achter de naam, gescheiden
   door een liggend streepje, bijvoorbeeld `MCA_0194_pentax-m-35.JPG`.
   Een thema kan erachter: `MCA_1226_pentax-a-50_autos.JPG`.
3. Zet de kale naam (zonder code en extensie) in de lijst `FOTOS` in
   `src/data/fotos.js`, bijvoorbeeld `'MCA_0194'`.

De site zoekt zelf het bestand, met of zonder code, en haalt de lens uit de
naam. Foto's zonder lenscode werken gewoon, die tonen alleen geen lens.

De lenscodes staan in `src/data/lenzen.js`:

| code          | lens                               |
|---------------|------------------------------------|
| `albinar-28`  | super albinar mc auto 28mm f2.8    |
| `pentax-m-35` | smc pentax-m 35mm f2               |
| `pentax-a-50` | smc pentax-a 50mm f2.8 (macro)     |
| `pentax-k-50` | smc pentax-k 50mm f4 (macro)       |
| `pentax-m-85` | smc pentax-m 85mm f2               |
| `pentax-m-135`| smc pentax-m 135mm f3.5            |
| `pentax-200`  | smc pentax 200mm f4                |

## Concerten aanpassen

Alles staat in `src/data/concerten.js`: de concerten zelf (`CONCERTEN`), het
wikipedia-artikel per venue (`LOCATIE_WIKI`), het nieuws per concertdatum
(`DAG_NIEUWS`) en de tekst van leesmij.txt (`LEESMIJ`).

## Lenzendatabase

`public/lenzendatabase/lenzen.db` (SQLite) wordt in de browser geladen met
sql.js. Zie `public/lenzendatabase/LEESMIJ.md` voor de tabellen. Vervang het
bestand en herlaad: de site haalt altijd de nieuwste versie op.

## Huisstijl

- Titelbalk van elk venster: klasse `venster-titelbalk` (in `src/index.css`).
- Bureaubladicoon (enkel klik selecteert, dubbelklik opent, versleepbaar):
  `src/components/DesktopIcoon.jsx`.
- Tabellen (lenzen en concerten) delen hun stijl via `Lenzendatabase.css`.

## Structuur

```
src/
  components/   Pagina (schil), Navbar, Taakbalk, Lightbox, vensters (WikiInfo,
                DagInfo, Leesmij, SpotifySpeler, LensEigenschappen,
                SchermInstellingen), DesktopIcoon en kleine icoontjes
  pages/        Gallerij, Concerten, Lenzendatabase (+ eigen css)
  hooks/        useMenuLayout (taakbalk even breed als de inhoud), useTeBreed
  lib/          fotonamen (lens/thema uit bestandsnaam), lenzendatabase (sql.js), ebay
  data/         fotos, lenzen, verhalen, concerten
  assets/       iconen/ en kluis/ (de foto's)
public/         favicon, lenzendatabase/, staticwebapp.config.json
```

## Hosting

Azure Static Web Apps: elke push naar `main` wordt automatisch gebouwd en
gepubliceerd (`.github/workflows`). De router gebruikt gewone paden
(`/concerten`); `public/staticwebapp.config.json` laat elke onbekende route
op `index.html` uitkomen, zodat zo'n link ook werkt bij direct openen of
verversen. Onderaan elke pagina staat de versie (commitcode + builddatum),
ingevuld door `vite.config.js`.
