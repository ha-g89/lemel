import { useEffect, useState } from 'react'
import Navbar from './Navbar.jsx'
import logo from '../assets/iconen/logo.png'
import gallerijIcoon from '../assets/iconen/gallerij.png'

function tijdNu() {
  const d = new Date()
  return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2)
}

function Klok() {
  const [tijd, zetTijd] = useState(tijdNu)
  useEffect(() => {
    const timer = setInterval(() => zetTijd(tijdNu()), 1000)
    return () => clearInterval(timer)
  }, [])
  return <span id="klok">{tijd}</span>
}

/**
 * De Windows-95-taakbalk onder de inhoud, met Start-knop, klok en
 * (optioneel) een knop voor een open venster, zoals bij de lightbox.
 * Het Start-menu (Navbar) hangt hier positioneel aan vast: het klapt
 * open vlak boven de Start-knop.
 * @param {boolean}  menuOpen      staat het Start-menu open
 * @param {Function} onToggleMenu  klik op Start: menu open/dicht
 * @param {Function} onSluitMenu   sluit het Start-menu (klik op een link erin)
 * @param {boolean}  metJaar       doorgegeven aan Navbar
 * @param {Function} [opAfsluiten] doorgegeven aan Navbar
 * @param {{ titel: string, onKlik: Function }} [venster]
 */
export default function Taakbalk({
  venster,
  menuOpen,
  onToggleMenu,
  onSluitMenu,
  metJaar,
  opAfsluiten,
}) {
  return (
    <div className="taakbalk">
      <Navbar
        metJaar={metJaar}
        open={menuOpen}
        onSluitMenu={onSluitMenu}
        opAfsluiten={opAfsluiten}
      />
      <button
        type="button"
        className={menuOpen ? 'startknop actief' : 'startknop'}
        onClick={onToggleMenu}
      >
        <img src={logo} alt="" />
        <span>Start</span>
      </button>
      <div className="greep"></div>
      {venster && (
        <button type="button" className="taakvenster" onClick={venster.onKlik}>
          <img src={gallerijIcoon} alt="" />
          <span>{venster.titel}</span>
        </button>
      )}
      <div className="lade">
        <Klok />
      </div>
    </div>
  )
}
