/**
 * Het rechtermuismenu van een vensterknop in de taakbalk, zoals in windows 95:
 * herstellen, minimaliseren, maximaliseren en sluiten. Wat in de huidige stand
 * niet kan is null en komt grijs in het menu (zie Taakbalk).
 * @param {object}   stand
 * @param {boolean}  stand.zichtbaar       niet geminimaliseerd
 * @param {boolean}  stand.gemaximaliseerd
 * @param {Function} stand.toon            haal het venster uit de taakbalk terug
 * @param {Function} stand.minimaliseer
 * @param {Function} stand.zetMaximaal     (boolean) => void
 * @param {Function} stand.sluit
 */
export function vensterMenu({ zichtbaar, gemaximaliseerd, toon, minimaliseer, zetMaximaal, sluit }) {
  return {
    herstellen:
      !zichtbaar || gemaximaliseerd
        ? () => (zichtbaar ? zetMaximaal(false) : toon())
        : null,
    minimaliseren: zichtbaar ? minimaliseer : null,
    maximaliseren:
      !zichtbaar || !gemaximaliseerd
        ? () => {
            zetMaximaal(true)
            toon()
          }
        : null,
    sluiten: sluit,
  }
}
