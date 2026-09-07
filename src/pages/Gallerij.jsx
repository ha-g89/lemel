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
  const [openFoto, zetOpenFoto] = useState(null)

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

  const sluitLightbox = useCallback(() => zetOpenFoto(null), [])

  return (
    <Pagina titel="le mel" metJaar>
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
              onClick={() => zetOpenFoto(foto)}
            />
          </div>
        ))}
      </div>

      <Lightbox foto={openFoto} onSluit={sluitLightbox} />
    </Pagina>
  )
}
