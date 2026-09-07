# lenzendatabase

Doorzoekbare database van vintage handmatige prime-lenzen: specs, marktprijzen en reviews.
Hoort bij le mel.

## Bestanden

| bestand | wat het is |
|---|---|
| `lenzen.db` | de database zelf (SQLite) |
| `lenzen_spine.csv` | platte export, voor als je even snel wil kijken zonder SQL |
| `LEESMIJ.md` | dit bestand |

## Tabellen

**`lenses`** — één rij per lens. Merk, model, vatting, brandpunt, max diafragma.
De kolommen `year_from`, `elements`, `min_focus_m`, `filter_mm`, `weight_g` en `blades`
staan klaar maar zijn nog leeg; die komen van de spec-bronnen.

**`prices`** — één rij per waargenomen prijs, met `seen_at`. Er wordt niets overschreven,
alleen toegevoegd. Daardoor bouwt de historie zich op en kun je over een paar maanden
zien of een vraagprijs normaal is of niet. `landed_eur` is de all-in prijs inclusief
btw, invoerrecht en afhandelingskosten.

**`reviews`** — beoordelingen per bron, met een cijfer en de gebruikte schaal.

**`collection`** — jouw eigen lenzen: `owned`, `wanted` of `sold`.
Gevuld uit `rugzak.html` en `kijklijst.html`.

## Nu in de database

240 lenzen, waarvan 7 in bezit en 1 op de kijklijst.

Belangrijk om te weten: de basis komt uit Lensfun, en dat dekt maar een klein deel van
wat er ooit gemaakt is — grofweg 15% van het vintage handmatige aanbod. Van jouw eigen
zeven stonden er twee in; de andere vijf zijn erbij gezet.

Aangevuld met 65 Pentax K/M/A-lenzen (smc Pentax, smc Pentax-M, smc Pentax-A/A*), aangeleverd
door de gebruiker als lijst. 20 modellen uit die lijst stonden al in de database (soms onder
een net iets andere schrijfwijze, zoals "smc Pentax-M Macro 1:4 50mm" i.p.v. "smc Pentax-M
50mm f/4 Macro") en zijn overgeslagen om duplicaten te voorkomen. Takumar-lenzen (andere
optische lijn/naam dan smc Pentax, ook al is de vatting soms K) zijn hierbij nooit op specs
gematcht, alleen op exacte naam — zie de generatie-waarschuwing hieronder. De rest van de
vintage-catalogus (andere merken, en verdere Pentax-varianten van derde partijen zoals
Vivitar/Tokina/Sigma/Tamron K-mount) moet nog van Pentax Forums en andere spec-bronnen komen.

## Een paar vragen om mee te beginnen

```sql
-- alles wat je hebt, met wat je het zelf waard vindt
SELECT l.maker, l.model, l.focal_mm, c.note
FROM lenses l JOIN collection c ON c.lens_id = l.id
WHERE c.status = 'owned' ORDER BY l.focal_mm;

-- prijsverloop van één lens
SELECT seen_at, source, price, currency, condition, landed_eur
FROM prices WHERE lens_id = 42 ORDER BY seen_at;

-- huidige vraagprijzen onder het langjarig gemiddelde
SELECT l.model, p.price, p.url,
       (SELECT AVG(price) FROM prices WHERE lens_id = l.id) AS gemiddeld
FROM prices p JOIN lenses l ON l.id = p.lens_id
WHERE p.seen_at = (SELECT MAX(seen_at) FROM prices)
  AND p.price < gemiddeld * 0.8;
```

## Let op bij generaties

Bij vintage glas is de generatie geen detail. Een `smc Pentax 200mm f/4` (K-serie) en een
`smc Pentax-M 200mm f/4` zijn verschillende optische ontwerpen die verschillend geprijsd
worden. De database koppelt daarom alleen bij een exacte modelnaam, nooit op
brandpunt plus diafragma alleen. Houd dat aan bij het handmatig toevoegen van rijen.
