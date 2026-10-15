import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Pagina from '../components/Pagina.jsx'
import Lightbox from '../components/Lightbox.jsx'
import FotoContextMenu from '../components/FotoContextMenu.jsx'
import DesktopIcoon from '../components/DesktopIcoon.jsx'
import Leesmij from '../components/Leesmij.jsx'
import leesmijIcoon from '../assets/iconen/leesmij.png'
import overmijIcoon from '../assets/iconen/overmij.png'
import patchnotesIcoon from '../assets/iconen/patchnotes.png'
import { useMenuLayout } from '../hooks/useMenuLayout.js'
import { useLightboxVensters } from '../hooks/useLightboxVensters.js'
import { FOTOLIJST, LEESMIJ, OVERMIJ } from '../data/fotos.js'
import { LENS_NAAM, THEMA_NAAM } from '../data/lenzen.js'
import { patchnotesTekst } from '../data/patchnotes.js'
import './Gallerij.css'

export default function Gallerij() {
  const [params] = useSearchParams()
  const lens = params.get('lens')
  const thema = params.get('thema')
  const lightbox = useLightboxVensters((foto) => foto.naam + '.jpg')
  const [contextMenu, zetContextMenu] = useState(null) /* { x, y, foto } */
  const [leesmijOpen, zetLeesmijOpen] = useState(false)
  const [overmijOpen, zetOvermijOpen] = useState(false)
  const [patchnotesOpen, zetPatchnotesOpen] = useState(false)
  /* vier iconen op het bureaubladje onderaan: naast elkaar, of op een smal
     scherm (telefoon) in twee rijen van twee */
  const [smal] = useState(() => window.matchMedia('(max-width: 700px)').matches)
  const plek = (nr) => (smal ? { x: nr % 2 ? 55 : -55, y: nr < 2 ? -40 : 40 } : { x: -180 + nr * 120, y: 0 })

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

  useMenuLayout({ deps: [lens, thema] })

  return (
    <Pagina
      titel="le mel"
      metJaar
      vensters={lightbox.taakbalkVensters}
      /* leesmij, overmij en patchnotes staan op het bureaubladje onder de
         foto's, naast "naar boven!!" (zie Pagina) */
      naarBovenPlek={plek(3)}
      bureaubladHoog={smal}
      bureaublad={
        <>
          <DesktopIcoon
            icoon={leesmijIcoon}
            naam="leesmij.txt"
            onOpen={() => zetLeesmijOpen(true)}
            sleepbaar
            opslagSleutel="lemel-leesmij-plek-start"
            beginX={plek(0).x}
            beginY={plek(0).y}
          />
          <DesktopIcoon
            icoon={overmijIcoon}
            naam="overmij.txt"
            onOpen={() => zetOvermijOpen(true)}
            sleepbaar
            opslagSleutel="lemel-overmij-plek-start"
            beginX={plek(1).x}
            beginY={plek(1).y}
          />
          <DesktopIcoon
            icoon={patchnotesIcoon}
            naam="patchnotes.txt"
            onOpen={() => zetPatchnotesOpen(true)}
            sleepbaar
            opslagSleutel="lemel-patchnotes-plek-start"
            beginX={plek(2).x}
            beginY={plek(2).y}
          />
        </>
      }
    >
      <h2 id="fotos"></h2>

      {filterGeldig && (
        <div id="filterbalk">
          <span id="filtertekst">
            {aantal} {aantal === 1 ? 'foto' : "foto's"} met {filternaam}
          </span>
          <Link to="/">toon alles</Link>
        </div>
      )}

      <div className="photogrid" data-doek>
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

      <Lightbox
        vensters={lightbox.vensters}
        fotolijst={zichtbareFotos}
        onSluit={lightbox.sluit}
        onMinimaliseer={lightbox.wissel}
        onMinimaliseerAlles={lightbox.minimaliseerAlles}
        onNavigeer={lightbox.navigeer}
      />

      {leesmijOpen && <Leesmij tekst={LEESMIJ} onSluiten={() => zetLeesmijOpen(false)} />}
      {overmijOpen && (
        <Leesmij
          tekst={OVERMIJ}
          naam="overmij.txt"
          icoon={overmijIcoon}
          onSluiten={() => zetOvermijOpen(false)}
        />
      )}
      {patchnotesOpen && (
        <Leesmij
          tekst={patchnotesTekst()}
          naam="patchnotes.txt"
          icoon={patchnotesIcoon}
          onSluiten={() => zetPatchnotesOpen(false)}
        />
      )}

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
