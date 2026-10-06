import { useLayoutEffect, useRef, useState } from 'react'
import './DesktopIcoon.css'

/* bewaarde plek: x als fractie van de breedte (zodat het ook klopt bij een
   ander schermformaat), y in pixels */
function leesPlek(sleutel) {
  if (!sleutel) return null
  try {
    const p = JSON.parse(localStorage.getItem(sleutel))
    if (p && Number.isFinite(p.fx) && Number.isFinite(p.y)) return p
  } catch {
    /* geen opslag beschikbaar */
  }
  return null
}
function bewaarPlek(sleutel, plek) {
  if (!sleutel) return
  try {
    localStorage.setItem(sleutel, JSON.stringify(plek))
  } catch {
    /* geen opslag beschikbaar */
  }
}

/**
 * Windows-95-bureaubladicoon: één klik selecteert (blauw gekleurd icoon,
 * blauwe naam met stippelrandje), dubbelklik opent. Op een touchscreen
 * opent één tik meteen, want dubbeltikken zoomt daar in. Enter opent ook.
 * Met `sleepbaar` kun je het binnen zijn ouder-element verslepen (die moet
 * position: relative hebben); begint gecentreerd.
 * @param {string}   icoon            url van het plaatje (32×32)
 * @param {string}   naam             tekst onder het icoon
 * @param {Function} onOpen           wordt aangeroepen bij openen
 * @param {boolean}  [sleepbaar]      verplaatsbaar binnen het ouder-element
 * @param {string}   [opslagSleutel]  localStorage-sleutel om de plek te onthouden
 * @param {number}   [beginX]         verschuiving in px t.o.v. het midden voor de beginplek,
 *                                    zodat meerdere iconen in één ruimte niet op elkaar beginnen
 */
export default function DesktopIcoon({ icoon, naam, onOpen, sleepbaar = false, opslagSleutel, beginX = 0 }) {
  const [geselecteerd, zetGeselecteerd] = useState(false)
  const [plek, zetPlek] = useState(null) /* { x, y } in px binnen de ouder */
  const aanraking = useRef(false)
  const sleep = useRef(null)
  const versleept = useRef(false)
  const ref = useRef(null)

  /* ruimte waarbinnen het icoon mag staan */
  function grenzen() {
    const el = ref.current
    const ouder = el.parentElement
    return { maxX: ouder.clientWidth - el.offsetWidth, maxY: ouder.clientHeight - el.offsetHeight }
  }
  function klem(x, y) {
    const { maxX, maxY } = grenzen()
    return { x: Math.min(Math.max(0, x), maxX), y: Math.min(Math.max(0, y), maxY) }
  }

  /* beginplek: bewaarde plek, anders midden van de ruimte */
  useLayoutEffect(() => {
    if (!sleepbaar) return
    const { maxX, maxY } = grenzen()
    const bewaard = leesPlek(opslagSleutel)
    // eslint-disable-next-line react-hooks/set-state-in-effect -- plek hangt af van gemeten afmetingen, moet vóór de eerste paint
    zetPlek(bewaard ? klem(bewaard.fx * maxX, bewaard.y) : klem(maxX / 2 + beginX, maxY / 2))
    // eslint-disable-next-line react-hooks/exhaustive-deps -- alleen bij laden meten
  }, [sleepbaar, opslagSleutel])

  function opPointerDown(e) {
    aanraking.current = e.pointerType === 'touch'
    versleept.current = false
    if (!sleepbaar || e.button !== 0 || !plek) return
    sleep.current = { startX: e.clientX, startY: e.clientY, vanaf: plek }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  function opPointerMove(e) {
    if (!sleep.current) return
    const dx = e.clientX - sleep.current.startX
    const dy = e.clientY - sleep.current.startY
    /* pas na een paar pixels is het slepen, anders gewoon een klik */
    if (!versleept.current && Math.abs(dx) + Math.abs(dy) < 4) return
    versleept.current = true
    zetGeselecteerd(true)
    zetPlek(klem(sleep.current.vanaf.x + dx, sleep.current.vanaf.y + dy))
  }
  function opPointerUp(e) {
    if (!sleep.current) return
    sleep.current = null
    e.currentTarget.releasePointerCapture(e.pointerId)
    if (versleept.current && plek) {
      const { maxX } = grenzen()
      bewaarPlek(opslagSleutel, { fx: maxX > 0 ? plek.x / maxX : 0.5, y: plek.y })
    }
  }

  const klassen = ['desktop-icoon']
  if (geselecteerd) klassen.push('geselecteerd')
  if (sleepbaar) klassen.push('sleepbaar')

  return (
    <button
      ref={ref}
      type="button"
      className={klassen.join(' ')}
      style={{
        '--icoon': `url(${icoon})`,
        ...(sleepbaar && plek ? { left: plek.x, top: plek.y } : undefined),
        ...(sleepbaar && !plek ? { visibility: 'hidden' } : undefined),
      }}
      onPointerDown={opPointerDown}
      onPointerMove={opPointerMove}
      onPointerUp={opPointerUp}
      onPointerCancel={opPointerUp}
      onClick={() => {
        zetGeselecteerd(true)
        if (aanraking.current && !versleept.current) onOpen()
      }}
      onDoubleClick={() => {
        if (!aanraking.current) onOpen()
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          onOpen()
        }
      }}
      onBlur={() => zetGeselecteerd(false)}
    >
      <span className="desktop-icoon-plaatje">
        <img src={icoon} alt="" draggable="false" />
      </span>
      <span className="desktop-icoon-naam">{naam}</span>
    </button>
  )
}
