import { useEffect, useLayoutEffect, useState } from 'react'
import { LENS_NAAM } from '../data/lenzen.js'
import { ebayZoeklink } from '../lib/fotonamen.js'
import ebayLogo from '../assets/iconen/ebay.png'
import Kruisje from './Kruisje.jsx'

/**
 * Eén Windows-95-venster met de aangeklikte foto op volle grootte. Blijft
 * gemount als het geminimaliseerd is (alleen met display:none verborgen),
 * zodat het laadprofiel niet opnieuw afspeelt bij terugzetten.
 * @param {object}   foto            item uit FOTOLIJST ({ url, naam, lens })
 * @param {boolean}  geminimaliseerd niet zichtbaar, maar wel nog gemount
 * @param {Function} onSluit         sluit dit venster helemaal (kruisje)
 */
function LightboxVenster({ foto, geminimaliseerd, onSluit }) {
  /* elke keer een ander, ongelijkmatig laadpatroon en -tempo, alsof een trage pc hapert */
  const [laadprofiel, zetLaadprofiel] = useState(null)
  useLayoutEffect(() => {
    const varianten = ['a', 'b', 'c']
    // eslint-disable-next-line react-hooks/set-state-in-effect -- willekeurig per keer openen, mag geen render-pure berekening zijn
    zetLaadprofiel({
      klasse: 'laadprofiel-' + varianten[Math.floor(Math.random() * varianten.length)],
      duur: Math.round(500 + Math.random() * 600) + 'ms',
    })
  }, [])

  const lensnaam = foto.lens ? LENS_NAAM[foto.lens] : null

  return (
    <div
      id="lightbox-venster"
      className={geminimaliseerd ? 'verborgen' : laadprofiel?.klasse}
      style={!geminimaliseerd && laadprofiel ? { animationDuration: laadprofiel.duur } : undefined}
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
  )
}

/**
 * Overlay met alle open lightbox-vensters ernaast, elk in zijn eigen kader.
 * Alle vensters (ook geminimaliseerde) blijven hier gemount zodat hun state
 * bewaard blijft; de overlay zelf verbergt zich pas als er niets zichtbaar is.
 * @param {{ basis: string, foto: object, geminimaliseerd: boolean }[]} vensters
 * @param {Function} onSluit             sluit één venster helemaal (basis) => void
 * @param {Function} onMinimaliseerAlles verberg alle zichtbare vensters, blijven in de taakbalk
 */
export default function Lightbox({ vensters, onSluit, onMinimaliseerAlles }) {
  const zichtbaar = vensters.filter((v) => !v.geminimaliseerd)

  useEffect(() => {
    function opToets(e) {
      if (e.key !== 'Escape' || !zichtbaar.length) return
      onSluit(zichtbaar[zichtbaar.length - 1].basis)
    }
    document.addEventListener('keydown', opToets)
    return () => document.removeEventListener('keydown', opToets)
  }, [zichtbaar, onSluit])

  if (!vensters.length) return null

  const klassen = []
  if (!zichtbaar.length) klassen.push('verborgen')
  if (zichtbaar.length > 1) klassen.push('meerdere')

  return (
    <div id="lightbox-overlay" className={klassen.join(' ') || undefined} onClick={onMinimaliseerAlles}>
      {vensters.map((v) => (
        <LightboxVenster
          key={v.basis}
          foto={v.foto}
          geminimaliseerd={v.geminimaliseerd}
          onSluit={() => onSluit(v.basis)}
        />
      ))}
    </div>
  )
}
