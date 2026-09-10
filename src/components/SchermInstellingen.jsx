import { useRef, useState } from 'react'
import weergaveIcoon from '../assets/iconen/weergave.png'
import Kruisje from './Kruisje.jsx'

const PIXEL_NIVEAU = 3 /* vast, grof pixel-niveau voor de "Pixelig"-knop (1 grofst .. 10 scherp) */

/* Effecten die met een CSS-filter/transform op de hele pagina werken.
   Elke knop is een aan/uit-schakelaar; meerdere mogen tegelijk aan staan.
   "pixelig" is een uitzondering: die tekent de pagina na via html2canvas
   in plaats van een simpele CSS-eigenschap te zetten. */
const EFFECTEN = [
  { sleutel: 'pixelig', label: 'Pixelig' },
  { sleutel: 'grijs', label: 'Grijstinten', stijl: { filter: 'grayscale(1)' } },
  { sleutel: 'negatief', label: 'Negatief', stijl: { filter: 'invert(1)' } },
  { sleutel: 'sepia', label: 'Sepia', stijl: { filter: 'sepia(0.8)' } },
  { sleutel: 'ondersteboven', label: 'Ondersteboven', stijl: { transform: 'rotate(180deg)' } },
]

/**
 * Paasei: een "Display Properties"-achtig venstertje met een rijtje
 * knoppen die elk een effect op de hele pagina aan/uit zetten.
 */
export default function SchermInstellingen() {
  const [open, zetOpen] = useState(false)
  const [effecten, zetEffecten] = useState(() => new Set())
  const canvasRef = useRef(null)

  function toggleVenster() {
    zetOpen((o) => !o)
  }

  function pasCssEffectenToe(nieuweSet) {
    const stijl = {}
    const filters = []
    for (const effect of EFFECTEN) {
      if (!effect.stijl || !nieuweSet.has(effect.sleutel)) continue
      if (effect.stijl.filter) filters.push(effect.stijl.filter)
      if (effect.stijl.transform) stijl.transform = effect.stijl.transform
    }
    if (filters.length) stijl.filter = filters.join(' ')
    /* eslint-disable react-hooks/immutability -- bewuste globale CSS-toggle voor het paasei, geen React-state */
    document.documentElement.style.filter = stijl.filter || ''
    document.documentElement.style.transform = stijl.transform || ''
    /* eslint-enable react-hooks/immutability */
  }

  async function tekenGepixeld() {
    const schermCanvas = canvasRef.current
    if (!schermCanvas) return

    const { default: html2canvas } = await import('html2canvas')
    const doelBreedte = Math.max(20, Math.round(PIXEL_NIVEAU * 12))
    const volledigeCanvas = await html2canvas(document.body, {
      backgroundColor: '#FFFFFF',
      scale: 1,
      logging: false,
      ignoreElements: (el) =>
        el.id === 'pixel-canvas-overlay' ||
        el.id === 'scherminstellingen-venster' ||
        el.id === 'scherminstellingen-icoon',
    })

    const verhouding = volledigeCanvas.height / volledigeCanvas.width
    const kleinBreedte = doelBreedte
    const kleinHoogte = Math.max(15, Math.round(kleinBreedte * verhouding))

    const tussenCanvas = document.createElement('canvas')
    tussenCanvas.width = kleinBreedte
    tussenCanvas.height = kleinHoogte
    const tussenCtx = tussenCanvas.getContext('2d')
    tussenCtx.imageSmoothingEnabled = true
    tussenCtx.drawImage(volledigeCanvas, 0, 0, kleinBreedte, kleinHoogte)

    const schermCtx = schermCanvas.getContext('2d')
    schermCanvas.width = volledigeCanvas.width
    schermCanvas.height = volledigeCanvas.height
    schermCanvas.style.width = '100%'
    schermCanvas.style.height = document.documentElement.scrollHeight + 'px'
    schermCtx.imageSmoothingEnabled = false
    schermCtx.clearRect(0, 0, schermCanvas.width, schermCanvas.height)
    schermCtx.drawImage(tussenCanvas, 0, 0, schermCanvas.width, schermCanvas.height)
    schermCanvas.style.display = 'block'
  }

  function zetPixeligUit() {
    if (canvasRef.current) canvasRef.current.style.display = 'none'
  }

  function toggleEffect(sleutel) {
    const nieuw = new Set(effecten)
    if (nieuw.has(sleutel)) nieuw.delete(sleutel)
    else nieuw.add(sleutel)

    if (sleutel === 'pixelig') {
      if (nieuw.has('pixelig')) tekenGepixeld()
      else zetPixeligUit()
    } else {
      pasCssEffectenToe(nieuw)
    }
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
                <button
                  key={effect.sleutel}
                  type="button"
                  className={effecten.has(effect.sleutel) ? 'effect-knop actief' : 'effect-knop'}
                  onClick={() => toggleEffect(effect.sleutel)}
                >
                  {effect.label}
                </button>
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

      <canvas id="pixel-canvas-overlay" ref={canvasRef}></canvas>
    </>
  )
}
