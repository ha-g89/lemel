import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Pagina from '../components/Pagina.jsx'
import DataVenster from '../components/DataVenster.jsx'
import Lightbox from '../components/Lightbox.jsx'
import FotoContextMenu from '../components/FotoContextMenu.jsx'
import gallerijIcoon from '../assets/iconen/gallerij.png'
import { useMenuLayout } from '../hooks/useMenuLayout.js'
import { useLightboxVensters } from '../hooks/useLightboxVensters.js'
import { useVensterStand } from '../hooks/useVensterStand.js'
import { FOTOLIJST } from '../data/fotos.js'
import { LENS_NAAM, THEMA_NAAM } from '../data/lenzen.js'
import './Gallerij.css'

export default function Gallerij() {
  const [params] = useSearchParams()
  const lens = params.get('lens')
  const thema = params.get('thema')
  const lightbox = useLightboxVensters((foto) => foto.naam + '.jpg')
  const [contextMenu, zetContextMenu] = useState(null) /* { x, y, foto } */

  /* filter alleen toepassen als de code bestaat, anders alles tonen */
  const filterGeldig = (lens && LENS_NAAM[lens]) || (thema && THEMA_NAAM[thema])
  const past = (foto) => {
    if (!filterGeldig) return true
    return lens ? foto.lens === lens : foto.themas.includes(thema)
  }
  const zichtbareFotos = FOTOLIJST.filter(past)
  const aantal = zichtbareFotos.length
  const filternaam = lens ? LENS_NAAM[lens] : THEMA_NAAM[thema]

  /* bij een filter alles direct laden, anders pas als de foto in beeld komt */
  const laadwijze = filterGeldig ? 'eager' : 'lazy'

  const titel = filterGeldig ? 'gallerij - ' + filternaam : 'gallerij'
  const gallerij = useVensterStand({ titel, icoon: gallerijIcoon })

  useMenuLayout({ deps: [lens, thema, gallerij.stand, gallerij.venster.gemaximaliseerd] })

  return (
    <Pagina
      titel="le mel"
      metJaar
      vensters={[...gallerij.taakbalkVensters, ...lightbox.taakbalkVensters]}
    >
      <DataVenster
        titel={titel}
        icoon={gallerijIcoon}
        venster={gallerij.venster}
        status={
          filterGeldig ? (
            <>
              <span>
                {aantal} {aantal === 1 ? 'foto' : "foto's"} met {filternaam}
              </span>
              <span className="smal">
                <Link to="/">toon alles</Link>
              </span>
            </>
          ) : (
            <span>{FOTOLIJST.length} objecten</span>
          )
        }
      >
        <div className="photogrid">
          {FOTOLIJST.map((foto) => {
            const lensnaam = foto.lens ? LENS_NAAM[foto.lens] : null
            const tooltip = foto.naam + '.jpg' + (lensnaam ? '  —  ' + lensnaam : '')
            return (
              <div
                key={foto.basis}
                className={past(foto) ? 'photobox' : 'photobox verborgen'}
                data-tooltip={tooltip}
              >
                <img
                  src={foto.klein || undefined}
                  alt={foto.naam}
                  loading={laadwijze}
                  /* pas zichtbaar als hij binnen is, dan komt hij als over een
                     trage modem van boven naar beneden in beeld; uit de cache
                     meteen, zonder animatie */
                  ref={(img) => {
                    if (img?.complete && img.naturalWidth) img.classList.add('binnen-direct')
                  }}
                  onLoad={(e) => e.currentTarget.classList.add('binnen')}
                  onClick={() => lightbox.open(foto)}
                  onContextMenu={(e) => {
                    e.preventDefault()
                    zetContextMenu({ x: e.clientX, y: e.clientY, foto })
                  }}
                />
              </div>
            )
          })}
        </div>
      </DataVenster>

      <Lightbox
        vensters={lightbox.vensters}
        fotolijst={zichtbareFotos}
        onSluit={lightbox.sluit}
        onMinimaliseer={lightbox.wissel}
        onMaximaliseer={lightbox.maximaliseer}
        onMinimaliseerAlles={lightbox.minimaliseerAlles}
        onNavigeer={lightbox.navigeer}
      />


      {contextMenu && (
        <FotoContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          foto={contextMenu.foto}
          onOpenen={() => lightbox.open(contextMenu.foto)}
          onSluiten={() => zetContextMenu(null)}
        />
      )}
    </Pagina>
  )
}
