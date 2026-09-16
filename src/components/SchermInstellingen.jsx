import { useState } from 'react'
import Kruisje from './Kruisje.jsx'
import './SchermInstellingen.css'

/* Effecten die met een CSS-filter op de hele pagina werken.
   Elke schakelaar is aan/uit; meerdere mogen tegelijk aan staan. */
const EFFECTEN = [
  { sleutel: 'grijs', label: 'Grijstinten', stijl: { filter: 'grayscale(1)' } },
  { sleutel: 'negatief', label: 'Negatief', stijl: { filter: 'invert(1)' } },
  { sleutel: 'sepia', label: 'Sepia', stijl: { filter: 'sepia(0.8)' } },
]

/**
 * Paasei: een "Display Properties"-achtig venstertje met een rijtje
 * knoppen die elk een effect op de hele pagina aan/uit zetten. Wordt
 * geopend vanuit "instellingen" in het Start-menu (zie Navbar.jsx).
 * @param {boolean}  open     staat het venster open
 * @param {Function} onClose  sluit het venster
 */
export default function SchermInstellingen({ open, onClose }) {
  const [effecten, zetEffecten] = useState(() => new Set())

  function pasCssEffectenToe(nieuweSet) {
    const filters = []
    for (const effect of EFFECTEN) {
      if (nieuweSet.has(effect.sleutel)) filters.push(effect.stijl.filter)
    }
    /* eslint-disable react-hooks/immutability -- bewuste globale CSS-toggle voor het paasei, geen React-state */
    document.documentElement.style.filter = filters.join(' ')
    /* eslint-enable react-hooks/immutability */
  }

  function toggleEffect(sleutel) {
    const nieuw = new Set(effecten)
    if (nieuw.has(sleutel)) nieuw.delete(sleutel)
    else nieuw.add(sleutel)
    pasCssEffectenToe(nieuw)
    zetEffecten(nieuw)
  }

  return (
    <div className={open ? 'scherminstellingen-overlay open' : 'scherminstellingen-overlay'} onClick={onClose}>
      <div id="scherminstellingen-venster" onClick={(e) => e.stopPropagation()}>
        <div className="titelbalk">
          <span>paasei</span>
          <span className="sluitknop" onClick={onClose}>
            <Kruisje />
          </span>
        </div>

        <div className="inhoud">
          <fieldset>
            <div className="effecten-grid">
              {EFFECTEN.map((effect) => (
                <label key={effect.sleutel} className="effect-optie">
                  <input
                    type="checkbox"
                    checked={effecten.has(effect.sleutel)}
                    onChange={() => toggleEffect(effect.sleutel)}
                  />
                  <span className="vinkje"></span>
                  {effect.label}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="loze-knoppenrij">
            <button type="button" className="loze-knop ok-knop" onClick={onClose}>
              <span>OK</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
