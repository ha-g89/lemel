import { useEffect } from 'react'
import Kruisje from './Kruisje.jsx'
import leesmijIcoon from '../assets/iconen/leesmij.png'

/**
 * Kladblok-venster met leesmij.txt: de gedachte achter een pagina.
 * @param {string}   tekst     inhoud van het tekstbestand
 * @param {Function} onSluiten sluit het venster
 */
export default function Leesmij({ tekst, onSluiten }) {
  useEffect(() => {
    function opToets(e) {
      if (e.key === 'Escape') onSluiten()
    }
    document.addEventListener('keydown', opToets)
    return () => document.removeEventListener('keydown', opToets)
  }, [onSluiten])

  return (
    <div className="eigenschappen-overlay" onClick={onSluiten}>
      <div className="eigenschappen-venster artiest-venster kladblok-venster" onClick={(e) => e.stopPropagation()}>
        <div className="titelbalk venster-titelbalk">
          <img className="titelbalk-icoon" src={leesmijIcoon} alt="" />
          <span className="titelbalk-tekst">leesmij.txt - kladblok</span>
          <span className="sluitknop" onClick={onSluiten}>
            <Kruisje />
          </span>
        </div>
        {/* alleen voor de sier, zoals het menu van het echte kladblok */}
        <div className="kladblok-menu" aria-hidden="true">
          <span><u>b</u>estand</span>
          <span><u>b</u>ewerken</span>
          <span><u>z</u>oeken</span>
          <span><u>h</u>elp</span>
        </div>
        <div className="kladblok-rand">
          <div className="kladblok-blad">{tekst}</div>
        </div>
      </div>
    </div>
  )
}
