import { useState } from 'react'
import weergaveIcoon from '../assets/iconen/weergave.png'
import Kruisje from './Kruisje.jsx'

/* Effecten die met een CSS-filter op de hele pagina werken.
   Elke schakelaar is aan/uit; meerdere mogen tegelijk aan staan. */
const EFFECTEN = [
  { sleutel: 'grijs', label: 'Grijstinten', stijl: { filter: 'grayscale(1)' } },
  { sleutel: 'negatief', label: 'Negatief', stijl: { filter: 'invert(1)' } },
  { sleutel: 'sepia', label: 'Sepia', stijl: { filter: 'sepia(0.8)' } },
]

/**
 * Paasei: een "Display Properties"-achtig venstertje met een rijtje
 * knoppen die elk een effect op de hele pagina aan/uit zetten.
 */
export default function SchermInstellingen() {
  const [open, zetOpen] = useState(false)
  const [effecten, zetEffecten] = useState(() => new Set())

  function toggleVenster() {
    zetOpen((o) => !o)
  }

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
    <>
      <button type="button" id="scherminstellingen-icoon" onClick={toggleVenster}>
        <img src={weergaveIcoon} alt="weergave-instellingen" />
      </button>

      <div id="scherminstellingen-venster" className={open ? 'open' : undefined}>
        <div className="titelbalk">
          <span>paasei</span>
          <span className="sluitknop" onClick={toggleVenster}>
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
            <button type="button" className="loze-knop ok-knop" onClick={toggleVenster}>
              <span>OK</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
