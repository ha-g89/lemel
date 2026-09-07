import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logo from '../assets/iconen/logo.png'

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

/* De Windows-95-taakbalk onder de inhoud, met Start-knop en klok. */
export default function Taakbalk() {
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
      <div className="lade">
        <Klok />
      </div>
    </div>
  )
}
