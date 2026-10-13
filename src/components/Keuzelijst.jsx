import { useEffect, useState } from 'react'

/* het pijltje is pixelart met zichtbare treetjes: elk pixeltje is een heel
   aantal schermpixels (zo blijft het strak), en het aantal rijen is zo
   gekozen dat het bij elke schermschaling (100%, 125%, 150%, telefoon)
   ongeveer 8×4 css-px groot oogt: altijd twee keer zo breed als hoog, met
   een punt van 2 pixels, zodat het nergens smaller of hoger lijkt */
function pijlMaat() {
  const dpr = window.devicePixelRatio || 1
  const pixel = Math.max(1, Math.round(dpr))
  const rijen = Math.max(3, Math.round((4 * dpr) / pixel))
  return { schaal: pixel / dpr, rijen, breedte: rijen * 2 }
}

/**
 * Win98-keuzelijst: een gewone <select> met rechts een grijs knopje met zwart
 * pijltje. Knopje en pijltje zijn echte elementen (randen en een inline svg)
 * i.p.v. een achtergrondplaatje, zodat ze op hele schermpixels vallen.
 * Zolang de lijst openstaat blijft het knopje ingedrukt. De browser meldt
 * niet wanneer zijn eigen uitklaplijst open of dicht gaat, dus dat volgen we
 * zelf: open bij een klik, dicht bij een keuze, een tweede klik, focus kwijt
 * of Escape/Enter/Tab.
 * Alle props gaan door naar de <select> (onChange en onBlur worden doorgegeven).
 */
export default function Keuzelijst({ children, onChange, onBlur, ...props }) {
  const [maat, zetMaat] = useState(pijlMaat)
  const [open, zetOpen] = useState(false)

  /* inzoomen in de browser verandert de pixelverhouding (en geeft een resize) */
  useEffect(() => {
    const meet = () => zetMaat(pijlMaat())
    window.addEventListener('resize', meet)
    return () => window.removeEventListener('resize', meet)
  }, [])

  const { schaal, rijen, breedte } = maat
  /* driehoek van boven naar beneden: elke rij aan beide kanten 1 pixel smaller */
  let pad = ''
  for (let i = 0; i < rijen; i++) pad += `M${i} ${i}h${breedte - 2 * i}v1H${i}z`

  return (
    <span className={open ? 'keuzelijst open' : 'keuzelijst'}>
      <select
        {...props}
        onMouseDown={() => zetOpen((o) => !o)}
        onChange={(e) => {
          zetOpen(false)
          if (onChange) onChange(e)
        }}
        onBlur={(e) => {
          zetOpen(false)
          if (onBlur) onBlur(e)
        }}
        /* keyup: terwijl de lijst openstaat vangt de browser het indrukken
           van Escape/Enter zelf af, alleen het loslaten komt nog binnen */
        onKeyUp={(e) => {
          if (e.key === 'Escape' || e.key === 'Enter' || e.key === 'Tab') zetOpen(false)
        }}
      >
        {children}
      </select>
      <span className="keuzelijst-knop" aria-hidden="true">
        <svg
          width={breedte * schaal}
          height={rijen * schaal}
          viewBox={`0 0 ${breedte} ${rijen}`}
          shapeRendering="crispEdges"
        >
          <path d={pad} fill="#000000" />
        </svg>
      </span>
    </span>
  )
}
