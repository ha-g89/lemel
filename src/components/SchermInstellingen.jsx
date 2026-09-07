import { useRef, useState } from 'react'
import weergaveIcoon from '../assets/iconen/weergave.png'

/**
 * Paasei: een "Display Properties"-venster met een Screen area-slider
 * die de hele pagina echt pixeleert (via html2canvas).
 */
export default function SchermInstellingen() {
  const [open, zetOpen] = useState(false)
  const [niveau, zetNiveau] = useState(10) /* 1 (grofste pixels) .. 10 (scherp/uit) */
  const [label, zetLabel] = useState('800 by 600 pixels')
  const canvasRef = useRef(null)

  function toggleVenster() {
    zetOpen((o) => !o)
  }

  async function pasSchermResolutieAan(waarde) {
    const nieuwNiveau = parseInt(waarde, 10)
    zetNiveau(nieuwNiveau)
    const schermCanvas = canvasRef.current

    if (nieuwNiveau >= 10) {
      zetLabel('1024 by 768 pixels')
      if (schermCanvas) schermCanvas.style.display = 'none'
      return
    }

    const breedteLabel = Math.round(320 + (nieuwNiveau - 1) * ((1024 - 320) / 9))
    const hoogteLabel = Math.round(240 + (nieuwNiveau - 1) * ((768 - 240) / 9))
    zetLabel(breedteLabel + ' by ' + hoogteLabel + ' pixels')

    const { default: html2canvas } = await import('html2canvas')
    const doelBreedte = Math.max(20, Math.round(nieuwNiveau * 12)) /* hoe lager, hoe grover */
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

    if (!schermCanvas) return
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

  return (
    <>
      <button type="button" id="scherminstellingen-icoon" onClick={toggleVenster}>
        <img src={weergaveIcoon} alt="weergave-instellingen" />
      </button>

      <div id="scherminstellingen-venster" className={open ? 'open' : undefined}>
        <div className="titelbalk">
          <span>paasei</span>
          <span className="sluitknop" onClick={toggleVenster}>
            &times;
          </span>
        </div>
        <div className="inhoud">
          <fieldset>
            <div className="schermarea-rij">
              <span>Less</span>
              <input
                type="range"
                id="schermslider"
                min="1"
                max="10"
                step="1"
                value={niveau}
                onInput={(e) => pasSchermResolutieAan(e.target.value)}
                onChange={() => {}}
              />
              <span>More</span>
            </div>
            <div id="schermarea-label">{label}</div>
            <div className="regenboogbalk"></div>
          </fieldset>
          <div className="loze-knoppenrij">
            <button type="button" className="loze-knop">OK</button>
            <button type="button" className="loze-knop">Cancel</button>
            <button type="button" className="loze-knop">Apply</button>
          </div>
        </div>
      </div>

      <canvas id="pixel-canvas-overlay" ref={canvasRef}></canvas>
    </>
  )
}
