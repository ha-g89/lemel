import { useCallback, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Pagina from '../components/Pagina.jsx'
import Lightbox from '../components/Lightbox.jsx'
import SchermInstellingen from '../components/SchermInstellingen.jsx'
import { useMenuLayout } from '../hooks/useMenuLayout.js'
import { FOTOLIJST } from '../data/fotos.js'
import { LENS_NAAM, THEMA_NAAM } from '../data/lenzen.js'
import './Gallerij.css'

export default function Gallerij() {
  const [params] = useSearchParams()
  const lens = params.get('lens')
  const thema = params.get('thema')
  /* elk open venster: { basis, foto, geminimaliseerd }. Meerdere tegelijk kan,
     ze komen dan ernaast in de overlay en krijgen elk hun eigen taakbalkknop. */
  const [vensters, zetVensters] = useState([])

  /* filter alleen toepassen als de code bestaat, anders alles tonen */
  const filterGeldig = (lens && LENS_NAAM[lens]) || (thema && THEMA_NAAM[thema])
  const past = (foto) => {
    if (!filterGeldig) return true
    return lens ? foto.lens === lens : foto.thema === thema
  }
  const aantal = FOTOLIJST.filter(past).length
  const filternaam = lens ? LENS_NAAM[lens] : THEMA_NAAM[thema]

  /* bij een filter alles direct laden, anders pas als de foto in beeld komt */
  const laadwijze = filterGeldig ? 'eager' : 'lazy'

  useMenuLayout({ deps: [lens, thema] })

  const openLightbox = useCallback((foto) => {
    zetVensters((lijst) => {
      const bestaat = lijst.some((v) => v.basis === foto.basis)
      if (bestaat) {
        return lijst.map((v) => (v.basis === foto.basis ? { ...v, geminimaliseerd: false } : v))
      }
      return [...lijst, { basis: foto.basis, foto, geminimaliseerd: false }]
    })
  }, [])
  const sluitLightbox = useCallback((basis) => {
    zetVensters((lijst) => lijst.filter((v) => v.basis !== basis))
  }, [])
  const wisselLightbox = useCallback((basis) => {
    zetVensters((lijst) =>
      lijst.map((v) => (v.basis === basis ? { ...v, geminimaliseerd: !v.geminimaliseerd } : v))
    )
  }, [])
  const minimaliseerAlles = useCallback(() => {
    zetVensters((lijst) => lijst.map((v) => ({ ...v, geminimaliseerd: true })))
  }, [])

  const taakbalkVensters = vensters.map((v) => ({
    basis: v.basis,
    titel: v.foto.naam + '.jpg',
    actief: !v.geminimaliseerd,
    onKlik: () => wisselLightbox(v.basis),
  }))

  return (
    <Pagina titel="le mel" metJaar vensters={taakbalkVensters}>
      <SchermInstellingen />

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
        {FOTOLIJST.map((foto) => (
          <div
            key={foto.basis}
            className={past(foto) ? 'photobox' : 'photobox verborgen'}
            data-lens={foto.lens || ''}
            data-thema={foto.thema || ''}
          >
            <img
              src={foto.url || undefined}
              alt={foto.naam}
              loading={laadwijze}
              onClick={() => openLightbox(foto)}
            />
          </div>
        ))}
      </div>

      <Lightbox vensters={vensters} onSluit={sluitLightbox} onMinimaliseerAlles={minimaliseerAlles} />
    </Pagina>
  )
}
