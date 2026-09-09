import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
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
 * @param {{ titel: string, onKlik: Function }} [venster]
 */
export default function Taakbalk({ venster }) {
  const { pathname } = useLocation()

  function startKlik(e) {
    /* op de gallerij zelf: alleen naar boven scrollen */
    if (pathname === '/') {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="taakbalk">
      <Link className="startknop" to="/" onClick={startKlik}>
        <img src={logo} alt="" />
        <span>Start</span>
      </Link>
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
