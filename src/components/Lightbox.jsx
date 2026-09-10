import { useEffect, useLayoutEffect, useState } from 'react'
import { LENS_NAAM } from '../data/lenzen.js'
import { ebayZoeklink } from '../lib/fotonamen.js'
import ebayLogo from '../assets/iconen/ebay.png'
import Kruisje from './Kruisje.jsx'

/**
 * Windows-95-venster met de aangeklikte foto op volle grootte.
 * @param {object}   foto     item uit FOTOLIJST ({ url, naam, lens })
 * @param {Function} onSluit  sluit het venster
 */
export default function Lightbox({ foto, onSluit }) {
  /* elke keer een ander, ongelijkmatig laadpatroon en -tempo, alsof een trage pc hapert */
  const [laadprofiel, zetLaadprofiel] = useState(null)
  useLayoutEffect(() => {
    if (!foto) return
    const varianten = ['a', 'b', 'c']
    // eslint-disable-next-line react-hooks/set-state-in-effect -- willekeurig per keer openen, mag geen render-pure berekening zijn
    zetLaadprofiel({
      klasse: 'laadprofiel-' + varianten[Math.floor(Math.random() * varianten.length)],
      duur: Math.round(500 + Math.random() * 600) + 'ms',
    })
  }, [foto])

  useEffect(() => {
    function opToets(e) {
      if (e.key === 'Escape') onSluit()
    }
    document.addEventListener('keydown', opToets)
    return () => document.removeEventListener('keydown', opToets)
  }, [onSluit])

  if (!foto) return null

  const lensnaam = foto.lens ? LENS_NAAM[foto.lens] : null

  return (
    <div id="lightbox-overlay" onClick={onSluit}>
      <div
        id="lightbox-venster"
        className={laadprofiel?.klasse}
        style={laadprofiel ? { animationDuration: laadprofiel.duur } : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        <div id="lightbox-titelbalk">
          <span id="lightbox-naam">
            {foto.naam}.jpg{lensnaam ? '  —  ' + lensnaam : ''}
          </span>
          <span id="lightbox-sluit" onClick={onSluit}>
            <Kruisje />
          </span>
        </div>
        <div id="lightbox-vlak">
          <img id="lightbox-img" src={foto.url} alt="" />
        </div>
        {lensnaam && (
          <div id="lightbox-onder">
            <a id="lightbox-ebay" href={ebayZoeklink(lensnaam)} target="_blank" rel="noopener noreferrer">
              <img src={ebayLogo} alt="eBay" />
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
