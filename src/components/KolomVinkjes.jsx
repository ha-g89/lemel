import './KolomVinkjes.css'

/**
 * Rij vinkjes om kolommen aan en uit te zetten. De vaste kolom (waar de naam
 * van de rij in staat) blijft altijd zichtbaar en krijgt geen vinkje.
 * @param {[string, string][]} kolommen  [sleutel, kop] per kolom
 * @param {string}   vast        sleutel van de kolom zonder vinkje
 * @param {Object}   toon        uit useKolommen (hooks/useKolommen.js)
 * @param {Function} onWissel    uit useKolommen (wisselKolom)
 */
export default function KolomVinkjes({ kolommen, vast, toon, onWissel }) {
  return (
    <div id="kolommenrij">
      {kolommen
        .filter(([kolom]) => kolom !== vast)
        .map(([kolom, kop]) => (
          <label key={kolom} className="kolom-optie">
            <input type="checkbox" checked={toon[kolom]} onChange={() => onWissel(kolom)} />
            <span className="kolom-vinkje"></span>
            {kop}
          </label>
        ))}
    </div>
  )
}
