import { useEffect, useLayoutEffect, useState } from 'react'
import { LENS_NAAM } from '../data/lenzen.js'
import { VERHAAL } from '../data/verhalen.js'
import { ebayZoeklink } from '../lib/ebay.js'
import ebayLogo from '../assets/iconen/ebay.png'
import Kruisje from './Kruisje.jsx'
import Streepje from './Streepje.jsx'
import Vergroten from './Vergroten.jsx'
import Vraagteken from './Vraagteken.jsx'

/**
 * Eén Windows-95-venster met de aangeklikte foto op volle grootte. Blijft
 * gemount als het geminimaliseerd is (alleen met display:none verborgen),
 * zodat het laadprofiel niet opnieuw afspeelt bij terugzetten.
 * @param {object}   foto            item uit FOTOLIJST ({ url, naam, lens })
 * @param {boolean}  geminimaliseerd niet zichtbaar, maar wel nog gemount
 * @param {Function} onSluit         sluit dit venster helemaal (kruisje)
 * @param {Function} onMinimaliseer  verberg dit venster (streepje), blijft in de taakbalk
 * @param {object}   [vorigeFoto]    vorige foto in de (gefilterde) lijst, of undefined bij de eerste
 * @param {object}   [volgendeFoto]  volgende foto in de (gefilterde) lijst, of undefined bij de laatste
 * @param {Function} onNavigeer      (nieuweFoto) => void, wisselt dit venster naar een andere foto
 */
function LightboxVenster({
  foto,
  geminimaliseerd,
  onSluit,
  onMinimaliseer,
  vorigeFoto,
  volgendeFoto,
  onNavigeer,
}) {
  /* elke keer een ander, ongelijkmatig laadpatroon en -tempo, alsof een trage pc hapert */
  const [laadprofiel, zetLaadprofiel] = useState(null)
  const [gemaximaliseerd, zetGemaximaliseerd] = useState(false)
  const [verhaalOpen, zetVerhaalOpen] = useState(false)
  useLayoutEffect(() => {
    const varianten = ['a', 'b', 'c']
    // eslint-disable-next-line react-hooks/set-state-in-effect -- willekeurig per keer openen, mag geen render-pure berekening zijn
    zetLaadprofiel({
      klasse: 'laadprofiel-' + varianten[Math.floor(Math.random() * varianten.length)],
      duur: Math.round(500 + Math.random() * 600) + 'ms',
    })
  }, [])

  const lensnaam = foto.lens ? LENS_NAAM[foto.lens] : null
  const verhaal = foto.basis ? VERHAAL[foto.basis] : null

  return (
    <div
      id="lightbox-venster"
      className={
        (geminimaliseerd ? 'verborgen' : laadprofiel?.klasse || '') +
        (gemaximaliseerd ? ' gemaximaliseerd' : '')
      }
      style={!geminimaliseerd && laadprofiel ? { animationDuration: laadprofiel.duur } : undefined}
      onClick={(e) => e.stopPropagation()}
    >
      <div id="lightbox-titelbalk">
        <span id="lightbox-naam">
          {foto.naam}.jpg{lensnaam ? '  —  ' + lensnaam : ''}
        </span>
        <span className="lightbox-knoppen">
          {verhaal && (
            <span
              id="lightbox-info"
              title="verhaal achter deze foto"
              onClick={() => zetVerhaalOpen((o) => !o)}
            >
              <Vraagteken />
            </span>
          )}
          <span id="lightbox-min" onClick={onMinimaliseer}>
            <Streepje />
          </span>
          <span id="lightbox-max" onClick={() => zetGemaximaliseerd((m) => !m)}>
            <Vergroten hersteld={gemaximaliseerd} />
          </span>
          <span id="lightbox-sluit" onClick={onSluit}>
            <Kruisje />
          </span>
        </span>
      </div>
      <div id="lightbox-vlak">
        <img id="lightbox-img" src={foto.url} alt="" />
        {verhaal && verhaalOpen && (
          <div id="lightbox-verhaal-venster" onClick={(e) => e.stopPropagation()}>
            <p id="lightbox-verhaal-tekst">{verhaal}</p>
          </div>
        )}
      </div>
      {(lensnaam || vorigeFoto || volgendeFoto) && (
        <div id="lightbox-onder">
          {(vorigeFoto || volgendeFoto) && (
            <span className="lightbox-navigatie">
              {vorigeFoto && (
                <span id="lightbox-vorige" onClick={() => onNavigeer(vorigeFoto)}>
                  vorige
                </span>
              )}
              {volgendeFoto && (
                <span id="lightbox-volgende" onClick={() => onNavigeer(volgendeFoto)}>
                  volgende
                </span>
              )}
            </span>
          )}
          {lensnaam && (
            <a id="lightbox-ebay" href={ebayZoeklink(lensnaam)} target="_blank" rel="noopener noreferrer">
              <img src={ebayLogo} alt="eBay" />
            </a>
          )}
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
 * @param {object[]} fotolijst          de (gefilterde) fotolijst waarbinnen vorige/volgende bladert
 * @param {Function} onSluit             sluit één venster helemaal (basis) => void
 * @param {Function} onMinimaliseer      verberg één venster (streepje) (basis) => void
 * @param {Function} onMinimaliseerAlles verberg alle zichtbare vensters, blijven in de taakbalk
 * @param {Function} onNavigeer          (basis, nieuweFoto) => void, wisselt een venster naar een andere foto
 */
export default function Lightbox({
  vensters,
  fotolijst,
  onSluit,
  onMinimaliseer,
  onMinimaliseerAlles,
  onNavigeer,
}) {
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
      {vensters.map((v) => {
        const index = fotolijst.findIndex((f) => f.basis === v.basis)
        return (
          <LightboxVenster
            key={v.basis}
            foto={v.foto}
            geminimaliseerd={v.geminimaliseerd}
            onSluit={() => onSluit(v.basis)}
            onMinimaliseer={() => onMinimaliseer(v.basis)}
            vorigeFoto={index > 0 ? fotolijst[index - 1] : undefined}
            volgendeFoto={index !== -1 && index < fotolijst.length - 1 ? fotolijst[index + 1] : undefined}
            onNavigeer={(nieuweFoto) => onNavigeer(v.basis, nieuweFoto)}
          />
        )
      })}
    </div>
  )
}
