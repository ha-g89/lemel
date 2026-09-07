# le mel

Fotosite met Windows-95-look, gebouwd in React + Vite. Eén-op-één nagebouwd
van de oorspronkelijke HTML-pagina's (index, kijklijst, rugzak, verkocht,
lenzendatabase).

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
| `/`                | `index.html`          | gallerij, lightbox, paasei (pixel-slider)    |
| `/?lens=<code>`    | `index.html?lens=`    | alleen foto's met die lens                   |
| `/?thema=autos`    | `index.html?thema=`   | alleen foto's met dat thema                  |
| `/kijklijst`       | `kijklijst.html`      | lenzen op de kijklijst                       |
| `/rugzak`          | `rugzak.html`         | lenzen in bezit, met "bekijk" naar de gallerij |
| `/verkocht`        | `verkocht.html`       | verkochte lenzen (nog leeg)                  |
| `/lenzendatabase`  | `lenzendatabase.html` | doorzoekbare SQLite-database via sql.js      |

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

## Lijsten aanpassen

- kijklijst: `src/data/kijklijst.js`
- rugzak: `src/data/rugzak.js`
- verkocht: `src/data/verkocht.js`

## Lenzendatabase

`public/lenzendatabase/lenzen.db` (SQLite) wordt in de browser geladen met
sql.js. Zie `public/lenzendatabase/LEESMIJ.md` voor de tabellen. Vervang het
bestand en herlaad: de site haalt altijd de nieuwste versie op.

## Structuur

```
src/
  components/   Pagina (schil), Navbar, Taakbalk, Lightbox, SchermInstellingen, LenzenTabel
  pages/        Gallerij, Kijklijst, Rugzak, Verkocht, Lenzendatabase (+ eigen css)
  hooks/        useMenuLayout: menu scrollt mee en landt op de taakbalk
  lib/          fotonamen (lens/thema uit bestandsnaam), lenzendatabase (sql.js)
  data/         lenzen, fotos, kijklijst, rugzak, verkocht
  assets/       iconen/ en kluis/ (de foto's)
public/         favicon, lenzendatabase/
```

## Hosting

De router gebruikt gewone paden (`/rugzak`). Op een statische host moet elke
onbekende route naar `index.html` vallen (Netlify/Vercel doen dat met een
rewrite-regel; op Apache met een `.htaccess`-fallback).
