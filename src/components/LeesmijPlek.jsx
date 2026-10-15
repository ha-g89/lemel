import { useState } from 'react'
import DesktopIcoon from './DesktopIcoon.jsx'
import Leesmij from './Leesmij.jsx'
import leesmijIcoon from '../assets/iconen/leesmij.png'
import './LeesmijPlek.css'

/**
 * Strook boven het databasevenster met een versleepbaar leesmij.txt-icoon;
 * dubbelklik opent het kladblok met de gedachte achter de pagina.
 * @param {string} tekst         inhoud van leesmij.txt
 * @param {string} opslagSleutel localStorage-sleutel voor de plek van het icoon
 */
export default function LeesmijPlek({ tekst, opslagSleutel }) {
  const [open, zetOpen] = useState(false)
  return (
    <>
      <div className="leesmij-plek-boven">
        <DesktopIcoon
          icoon={leesmijIcoon}
          naam="leesmij.txt"
          onOpen={() => zetOpen(true)}
          sleepbaar
          opslagSleutel={opslagSleutel}
        />
      </div>
      {open && <Leesmij tekst={tekst} onSluiten={() => zetOpen(false)} />}
    </>
  )
}
